"use client";

import { useState, type FormEvent } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [asset, setAsset] = useState<File | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({
      title,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      thumbnail,
      asset,
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-300">
            Admin
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">作品投稿</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium text-slate-200"
            >
              タイトル <span className="text-emerald-300">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="作品タイトルを入力"
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-50 placeholder-slate-500 outline-none transition focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/50"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-200"
            >
              説明文
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="作品の説明を入力（任意）"
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-50 placeholder-slate-500 outline-none transition focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/50"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="tags"
              className="text-sm font-medium text-slate-200"
            >
              タグ
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例: Three.js, React, WebGL（カンマ区切り）"
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-50 placeholder-slate-500 outline-none transition focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/50"
            />
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="thumbnail"
              className="text-sm font-medium text-slate-200"
            >
              サムネイル画像
            </label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-400 outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-300/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-emerald-100 hover:file:bg-emerald-300/20 focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/50"
            />
          </div>

          {/* 3D Asset */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="asset"
              className="text-sm font-medium text-slate-200"
            >
              3Dアセットファイル (.glb / .gltf)
            </label>
            <input
              id="asset"
              type="file"
              accept=".glb,.gltf"
              onChange={(e) => setAsset(e.target.files?.[0] ?? null)}
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-400 outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-300/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-emerald-100 hover:file:bg-emerald-300/20 focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/50"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 rounded-xl bg-emerald-400/15 px-6 py-3 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/30 transition hover:bg-emerald-400/25 hover:ring-emerald-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            送信する
          </button>
        </form>
      </div>
    </main>
  );
}
