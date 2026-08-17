import { neon } from "@neondatabase/serverless";
import Image from "next/image";
import Link from "next/link";

const sql = neon(process.env.DATABASE_URL!);

type Work = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string;
  tags: string[];
};

async function getWorks(): Promise<Work[]> {
  const rows = await sql`
    SELECT id, title, description, thumbnail_url, tags
    FROM works
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    ...(row as Omit<Work, "tags">),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
  }));
}

export default async function Home() {
  const works = await getWorks();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-300">
            Portfolio Gallery
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold sm:text-4xl">
              作品一覧
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              制作した作品の一覧を紹介しています。
            </p>
          </div>
        </header>

        {works.length === 0 ? (
          <p className="text-center text-slate-400">まだ作品が登録されていません。</p>
        ) : (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.id}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(15,23,42,0.35)] transition duration-200 hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                  <Image
                    src={work.thumbnail_url}
                    alt={`${work.title} のサムネイル`}
                    width={800}
                    height={600}
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col gap-4 p-5">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">
                      {work.title}
                    </h2>
                    {work.description && (
                      <p className="text-sm leading-6 text-slate-300">
                        {work.description}
                      </p>
                    )}
                  </div>
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
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
