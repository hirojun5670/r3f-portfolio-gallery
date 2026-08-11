import Image from "next/image";
import Link from "next/link";

const works = [
  {
    id: "work-aurora-room",
    title: "Aurora Room",
    description: "光の演出を意識したインテリアビジュアル",
    thumbnail_url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#22c55e" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#bg)" rx="40" />
          <circle cx="640" cy="180" r="120" fill="#a7f3d0" fill-opacity="0.6" />
          <text x="60" y="470" font-size="72" fill="#f8fafc" font-family="Arial, sans-serif">Aurora Room</text>
        </svg>
      `),
    tags: ["Blender", "Cycles", "Interior"],
  },
  {
    id: "work-cyber-garden",
    title: "Cyber Garden",
    description: "植物とネオンを組み合わせたコンセプトアート",
    thumbnail_url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#111827" />
              <stop offset="100%" stop-color="#9333ea" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#bg)" rx="40" />
          <path d="M130 420 C240 180 430 180 520 420" stroke="#86efac" stroke-width="24" fill="none" stroke-linecap="round" />
          <circle cx="610" cy="190" r="82" fill="#22d3ee" fill-opacity="0.75" />
          <text x="60" y="490" font-size="68" fill="#f8fafc" font-family="Arial, sans-serif">Cyber Garden</text>
        </svg>
      `),
    tags: ["Concept Art", "Neon", "Environment"],
  },
  {
    id: "work-silent-mecha",
    title: "Silent Mecha",
    description: "重量感のあるハードサーフェスモデル",
    thumbnail_url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#1f2937" />
              <stop offset="100%" stop-color="#f97316" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#bg)" rx="40" />
          <rect x="260" y="130" width="220" height="240" rx="36" fill="#e5e7eb" fill-opacity="0.78" />
          <rect x="210" y="380" width="320" height="70" rx="35" fill="#9ca3af" fill-opacity="0.85" />
          <text x="60" y="520" font-size="68" fill="#f8fafc" font-family="Arial, sans-serif">Silent Mecha</text>
        </svg>
      `),
    tags: ["Hard Surface", "Sci-Fi", "Substance 3D"],
  },
  {
    id: "work-coastal-cafe",
    title: "Coastal Cafe",
    description: "やわらかな昼光で構成した背景モデル",
    thumbnail_url:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#0f766e" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#bg)" rx="40" />
          <rect x="110" y="170" width="580" height="220" rx="28" fill="#fffbeb" fill-opacity="0.82" />
          <rect x="180" y="220" width="120" height="120" rx="20" fill="#5eead4" fill-opacity="0.8" />
          <text x="60" y="500" font-size="68" fill="#f8fafc" font-family="Arial, sans-serif">Coastal Cafe</text>
        </svg>
      `),
    tags: ["Background", "Lighting", "Cafe"],
  },
] as const;

export default function Home() {
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
              モックデータを使用した作品カード一覧です。スマホからPCまで崩れにくいグリッドで表示します。
            </p>
          </div>
        </header>

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
                  <p className="text-sm leading-6 text-slate-300">
                    {work.description}
                  </p>
                </div>
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
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
