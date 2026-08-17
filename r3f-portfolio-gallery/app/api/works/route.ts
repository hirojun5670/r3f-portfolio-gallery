import { neon } from "@neondatabase/serverless";
import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { DEFAULT_BACKGROUND_COLOR } from "@/lib/works/constants";

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getRequiredFileField(formData: FormData, key: string): File | null {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function parseTags(formData: FormData): string[] {
  const values = formData
    .getAll("tags")
    .filter((value): value is string => typeof value === "string");

  return values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function sanitizeFilename(name: string): string {
  return name
    .split(/[\\/]/)
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]/g, "-") || "file";
}

function parseBackgroundColor(formData: FormData): string {
  const value = getStringField(formData, "backgroundColor").trim();
  return HEX_COLOR_PATTERN.test(value) ? value.toLowerCase() : DEFAULT_BACKGROUND_COLOR;
}

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { error: "Server configuration is missing." },
      { status: 500 }
    );
  }

  const sql = neon(databaseUrl);

  try {
    const rows = await sql`
      SELECT id, title, thumbnail_url
      FROM works
      ORDER BY created_at DESC
    `;

    return NextResponse.json(
      rows.map((row) => ({
        id: row.id as string,
        title: row.title as string,
        thumbnail_url: row.thumbnail_url as string,
      }))
    );
  } catch (error) {
    console.error("[GET /api/works] failed", error);
    return NextResponse.json(
      { error: "Failed to fetch works." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Server configuration is missing." },
      { status: 500 }
    );
  }

  const sql = neon(databaseUrl);

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Content-Type must be multipart/form-data." },
      { status: 415 }
    );
  }

  try {
    const formData = await request.formData();
    const title = getStringField(formData, "title").trim();
    const descriptionValue = getStringField(formData, "description").trim();
    const description = descriptionValue === "" ? null : descriptionValue;
    const tags = parseTags(formData);
    const backgroundColor = parseBackgroundColor(formData);

    const thumbnail = getRequiredFileField(formData, "thumbnail");
    const asset = getRequiredFileField(formData, "asset");

    if (!title || !thumbnail || !asset) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, thumbnail, and asset are required.",
        },
        { status: 400 }
      );
    }

    const thumbnailBlob = await put(
      `thumbnails/${sanitizeFilename(thumbnail.name)}`,
      thumbnail,
      {
        access: "public",
        addRandomSuffix: true,
        contentType: thumbnail.type || undefined,
      }
    );

    let assetBlobUrl: string | null = null;

    try {
      const assetBlob = await put(`models/${sanitizeFilename(asset.name)}`, asset, {
        access: "public",
        addRandomSuffix: true,
        contentType: asset.type || undefined,
      });
      assetBlobUrl = assetBlob.url;

      const rows = await sql`
        INSERT INTO works (title, description, thumbnail_url, asset_url, tags, background_color)
        VALUES (${title}, ${description}, ${thumbnailBlob.url}, ${assetBlob.url}, ${tags}, ${backgroundColor})
        RETURNING id
      `;

      const createdId = rows[0]?.id;
      if (createdId == null) {
        throw new Error("Failed to read inserted id.");
      }

      revalidatePath("/");
      return NextResponse.json({ id: createdId }, { status: 201 });
    } catch (error) {
      const urlsToDelete = assetBlobUrl
        ? [thumbnailBlob.url, assetBlobUrl]
        : [thumbnailBlob.url];

      await del(urlsToDelete).catch((deleteError) => {
        console.error("[POST /api/works] blob cleanup failed", deleteError);
      });
      throw error;
    }
  } catch (error) {
    console.error("[POST /api/works] failed", error);
    return NextResponse.json(
      { error: "Failed to create work." },
      { status: 500 }
    );
  }
}
