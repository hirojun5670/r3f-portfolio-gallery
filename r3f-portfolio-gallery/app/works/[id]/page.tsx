import { neon } from "@neondatabase/serverless";
import Link from "next/link";
import { notFound } from "next/navigation";
import ModelViewer from "./ModelViewer";

const sql = neon(process.env.DATABASE_URL!);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Work = {
  id: string;
  title: string;
  description: string | null;
  asset_url: string;
  tags: string[];
};

async function getWorkById(id: string): Promise<Work | null> {
  const rows = await sql`
    SELECT id, title, description, asset_url, tags
    FROM works
    WHERE id = ${id}
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string | null) ?? null,
    asset_url: row.asset_url as string,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  };
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  const work = await getWorkById(id);

  if (!work) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/"
          className="w-fit text-sm text-emerald-300 transition hover:text-emerald-200"
        >
          ← 一覧ページへ戻る
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl font-semibold sm:text-4xl">{work.title}</h1>
          {work.description && (
            <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {work.description}
            </p>
          )}
          {work.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <ModelViewer assetUrl={work.asset_url} />
      </div>
    </main>
  );
}
