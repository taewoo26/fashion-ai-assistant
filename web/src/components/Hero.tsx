"use client";

import { metrics, products } from "@/lib/data";
import { useChat } from "./chat/ChatProvider";

export function Hero() {
  const { openChat } = useChat();
  const d = metrics.dataset;
  const summarized = products.filter((p) => p.summary).length;
  const stats = [
    { v: d.products.toLocaleString(), l: "상품" },
    { v: d.reviews.toLocaleString(), l: "학습 리뷰" },
    { v: summarized.toLocaleString(), l: "AI 리뷰 요약" },
    { v: `${(metrics.latency.medianMs / 1000).toFixed(1)}s`, l: "챗봇 응답 (중앙값)" },
  ];

  return (
    <section className="scanline relative flex min-h-[86dvh] items-center overflow-hidden border-b border-line">
      <div className="grid-bg absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[10%] top-[60%] h-[300px] w-[300px] rounded-full bg-accent-2/10 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6">
        <div className="rise mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-accent" />
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.4em] text-accent">
            AI Fashion Commerce · Demo
          </span>
        </div>

        <h1 className="glow-text rise font-display text-[15vw] font-black leading-[0.9] tracking-tighter sm:text-8xl lg:text-[9rem]">
          AXIS<span className="text-accent">//</span>
          <br className="sm:hidden" />
          WEAR
        </h1>

        <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-ink/90 sm:text-xl" style={{ animationDelay: "120ms" }}>
          리뷰 수천 개를 AI가 먼저 읽었어요.
          <br />
          <span className="text-muted">"작게 나와요?" 같은 질문에 리뷰를 근거로 답하는 쇼핑몰.</span>
        </p>

        <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "200ms" }}>
          <button
            onClick={openChat}
            className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-bg shadow-[0_0_40px_-8px_rgb(79_140_255/0.8)] transition hover:bg-accent-2"
          >
            AI 스타일리스트에게 물어보기
          </button>
          <a
            href="#shop"
            className="rounded-full border border-line-strong px-6 py-3 text-sm text-ink transition hover:border-accent hover:text-accent"
          >
            상품 둘러보기
          </a>
        </div>

        <dl className="rise mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4" style={{ animationDelay: "280ms" }}>
          {stats.map((s) => (
            <div key={s.l} className="bg-bg/80 px-4 py-4 backdrop-blur">
              <dt className="text-[11px] text-dim">{s.l}</dt>
              <dd className="mt-1 font-display text-xl font-bold text-ink">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
