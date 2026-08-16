import { neon } from "@neondatabase/serverless";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: RouteContext) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Server configuration is missing." },
      { status: 500 }
    );
  }

  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Work not found." }, { status: 404 });
  }

  const sql = neon(databaseUrl);

  try {
    const rows = await sql`
      SELECT thumbnail_url, asset_url
      FROM works
      WHERE id = ${id}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: "Work not found." }, { status: 404 });
    }

    const row = rows[0];
    await del([row.thumbnail_url as string, row.asset_url as string]);

    await sql`
      DELETE FROM works
      WHERE id = ${id}
    `;

    revalidatePath("/");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`[DELETE /api/works/${id}] failed`, error);
    return NextResponse.json({ error: "Failed to delete work." }, { status: 500 });
  }
}
