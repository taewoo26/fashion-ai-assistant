"use client";

import Link from "next/link";
import { meta } from "@/lib/data";
import { useChat } from "./chat/ChatProvider";

export const GITHUB_URL = "https://github.com/taewoo26/fashion-ai-assistant";

export function Header() {
  const { openChat } = useChat();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
      {meta.mode === "sample" && (
        <div className="border-b border-small/20 bg-small/10 px-4 py-1.5 text-center text-[11px] text-small">
          샘플 데이터 화면이에요 · 06 노트북으로 실제 결과를 내보내면 바뀌어요
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-lg font-black tracking-tight sm:text-xl">
          AXIS<span className="text-accent">//</span>WEAR
        </Link>
        <nav className="flex items-center gap-1 sm:gap-6">
          <Link
            href="/#shop"
            className="hidden font-display text-[10px] font-bold uppercase tracking-[0.25em] text-muted transition hover:text-ink sm:block"
          >
            Shop
          </Link>
          <Link
            href="/#core"
            className="hidden font-display text-[10px] font-bold uppercase tracking-[0.25em] text-muted transition hover:text-ink sm:block"
          >
            How it works
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden font-display text-[10px] font-bold uppercase tracking-[0.25em] text-muted transition hover:text-ink md:block"
          >
            GitHub
          </a>
          <button
            onClick={openChat}
            className="rounded-full border border-accent/60 bg-accent/10 px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition hover:bg-accent hover:text-bg"
          >
            AI Stylist
          </button>
        </nav>
      </div>
    </header>
  );
}
