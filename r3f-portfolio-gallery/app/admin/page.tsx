"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { DEFAULT_BACKGROUND_COLOR } from "@/lib/works/constants";

type WorkSummary = {
  id: string;
  title: string;
  thumbnail_url: string;
};

export default function AdminPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BACKGROUND_COLOR);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [asset, setAsset] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [works, setWorks] = useState<WorkSummary[]>([]);
  const [isLoadingWorks, setIsLoadingWorks] = useState(true);
  const [worksErrorMessage, setWorksErrorMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchWorks() {
      setIsLoadingWorks(true);
      setWorksErrorMessage(null);

      try {
        const response = await fetch("/api/works", { cache: "no-store" });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error ??
              `一覧の取得に失敗しました (${response.status})`
          );
        }

        const data = await response.json();
        if (!ignore) {
          setWorks(Array.isArray(data) ? (data as WorkSummary[]) : []);
        }
      } catch (error) {
        if (!ignore) {
          setWorksErrorMessage(
            error instanceof Error
              ? error.message
              : "一覧の取得に失敗しました。"
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingWorks(false);
        }
      }
    }

    fetchWorks();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("backgroundColor", backgroundColor);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (asset) formData.append("asset", asset);

    try {
      const response = await fetch("/api/works", {
        method: "POST",
        body: formData,
      });

      if (response.status === 201) {
        setTitle("");
        setDescription("");
        setTags("");
        setBackgroundColor(DEFAULT_BACKGROUND_COLOR);
        setThumbnail(null);
        setAsset(null);
        formRef.current?.reset();
        router.push("/");
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(
          (data as { error?: string }).error ?? `エラーが発生しました (${response.status})`
        );
      }

    } catch {
      setErrorMessage("ネットワークエラーが発生しました。再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteWork(work: WorkSummary) {
    const shouldDelete = window.confirm(`「${work.title}」を削除しますか？`);
    if (!shouldDelete) {
      return;
    }

    setDeletingId(work.id);
    setWorksErrorMessage(null);

    try {
      const response = await fetch(`/api/works/${work.id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        setWorks((prev) => prev.filter((item) => item.id !== work.id));
        return;
      }

      const data = await response.json().catch(() => ({}));
      setWorksErrorMessage(
        (data as { error?: string }).error ?? `削除に失敗しました (${response.status})`
      );
    } catch {
      setWorksErrorMessage("ネットワークエラーが発生しました。再度お試しください。");
    } finally {
      setDeletingId(null);
    }
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
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
        >
          {errorMessage && (
            <p role="alert" className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300 ring-1 ring-red-400/30">
              {errorMessage}
            </p>
          )}
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

          {/* Canvas Background Color */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="backgroundColor"
              className="text-sm font-medium text-slate-200"
            >
              Canvas背景色
            </label>
            <input
              id="backgroundColor"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-11 w-20 cursor-pointer rounded-xl border border-white/10 bg-slate-900 p-1 outline-none transition focus:border-emerald-300/50 focus:ring-1 focus:ring-emerald-300/50"
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
            disabled={isSubmitting}
            className="mt-2 rounded-xl bg-emerald-400/15 px-6 py-3 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-300/30 transition hover:bg-emerald-400/25 hover:ring-emerald-300/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
        </form>

        <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)]">
          <h2 className="text-xl font-semibold">既存作品</h2>

          {worksErrorMessage && (
            <p
              role="alert"
              className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-300 ring-1 ring-red-400/30"
            >
              {worksErrorMessage}
            </p>
          )}

          {isLoadingWorks ? (
            <p className="text-sm text-slate-300">読み込み中...</p>
          ) : works.length === 0 ? (
            <p className="text-sm text-slate-300">登録済みの作品はありません。</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {works.map((work) => (
                <li
                  key={work.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-3"
                >
                  <Image
                    src={work.thumbnail_url}
                    alt={`${work.title} のサムネイル`}
                    width={64}
                    height={48}
                    className="h-12 w-16 rounded-lg border border-white/10 object-cover"
                    unoptimized
                  />
                  <p className="flex-1 text-sm text-slate-100">{work.title}</p>
                  <button
                    type="button"
                    onClick={() => handleDeleteWork(work)}
                    disabled={deletingId === work.id}
                    className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-200 ring-1 ring-red-400/30 transition hover:bg-red-500/25 hover:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === work.id ? "削除中..." : "削除"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
