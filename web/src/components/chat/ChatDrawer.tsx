"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORY_KO, chatDemos, getProduct, SIZE_KO } from "@/lib/data";
import type { Category, ParsedQuery } from "@/lib/types";
import { NumberedText, ProductImage } from "../ui";
import { type ChatMessage, useChat } from "./ChatProvider";

const INTENT_KO: Record<ParsedQuery["intent"], string> = {
  search: "상품 검색",
  product_qa: "상품 질문",
  compare: "상품 비교",
  other: "기타",
};

function ParsedChips({ p }: { p: ParsedQuery }) {
  const chips: [string, string][] = [["의도", INTENT_KO[p.intent]]];
  if (p.productType)
    chips.push(["종류", CATEGORY_KO[p.productType as Category] ?? p.productType]);
  if (p.searchText) chips.push(["검색문", p.searchText]);
  if (p.sizeFit !== "any") chips.push(["사이즈", SIZE_KO[p.sizeFit]]);
  if (p.maxPrice > 0) chips.push(["가격", `≤ $${p.maxPrice}`]);
  if (p.refs.length) chips.push(["상품", p.refs.map((r) => `${r}번`).join(", ")]);
  return (
    <div className="mb-2 flex flex-wrap gap-1">
      {chips.map(([k, v]) => (
        <span key={k} className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted">
          <span className="text-dim">{k}</span> {v}
        </span>
      ))}
    </div>
  );
}

function Typewriter({ text, animate }: { text: string; animate: boolean }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) return;
    const step = Math.max(1, Math.round(text.length / 90));
    const t = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          window.clearInterval(t);
          return v;
        }
        return Math.min(text.length, v + step);
      });
    }, 18);
    return () => window.clearInterval(t);
  }, [text, animate]);
  const shown = animate ? n : text.length;
  const done = shown >= text.length;
  return (
    <span className={done ? "" : "caret"}>
      <NumberedText text={text.slice(0, shown)} />
    </span>
  );
}

function MiniProducts({ ids, numbers }: { ids: string[]; numbers: number[] }) {
  return (
    <div className="-mx-1 mb-2 flex gap-2 overflow-x-auto px-1 pb-1">
      {ids.map((id, i) => {
        const p = getProduct(id);
        if (!p) return null;
        return (
          <Link
            key={id + i}
            href={`/product/${id}/`}
            className="flex w-32 shrink-0 flex-col overflow-hidden rounded-lg border border-line bg-bg transition hover:border-accent/60"
          >
            <div className="relative h-24">
              <ProductImage product={p} />
              <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 font-mono text-[10px] font-bold text-bg">
                {numbers[i]}
              </span>
            </div>
            <div className="p-2">
              <p className="line-clamp-2 text-[11px] leading-snug text-ink">{p.title}</p>
              <p className="mt-1 text-[10px] text-muted">📏 {p.summary ? SIZE_KO[p.summary.sizeFit] : "정보 없음"}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

const SOURCE_LABEL = {
  recorded: { text: "05 노트북 녹화 응답", cls: "text-accent-2 border-accent-2/40" },
  offline: { text: "오프라인 데모 응답", cls: "text-small border-small/40" },
  system: { text: "안내", cls: "text-muted border-line" },
};

function Message({ m, latest }: { m: ChatMessage; latest: boolean }) {
  const { send, busy } = useChat();
  if (m.role === "user") {
    return (
      <div className="rise flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-sm text-bg">{m.text}</p>
      </div>
    );
  }
  const src = SOURCE_LABEL[m.source];
  return (
    <div className="rise flex flex-col">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="font-display text-[10px] font-bold tracking-widest text-accent">AXIS AI</span>
        <span className={`rounded border px-1 text-[9px] ${src.cls}`}>{src.text}</span>
        {m.latencyMs != null && <span className="font-mono text-[10px] text-dim">{(m.latencyMs / 1000).toFixed(1)}s</span>}
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-line bg-surface-2 p-3">
        {m.parsed && <ParsedChips p={m.parsed} />}
        {m.products.length > 0 && <MiniProducts ids={m.products} numbers={m.numbers} />}
        <p className="text-sm leading-relaxed text-ink/90">
          <Typewriter text={m.answer} animate={latest && m.source !== "system"} />
        </p>
        {m.suggestions && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {m.suggestions.map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => send(s)}
                className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted transition hover:border-accent hover:text-accent disabled:opacity-40"
              >
                {s.replace(/^1번 /, "")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatDrawer() {
  const { open, closeChat, openChat, messages, send, busy, playDemo, reset } = useChat();
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeChat();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeChat]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    send(text);
    setText("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={openChat}
          aria-label="AI 스타일리스트 열기"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-accent/60 bg-bg/90 py-3 pl-4 pr-5 shadow-[0_0_40px_-6px_rgb(79_140_255/0.7)] backdrop-blur transition hover:bg-accent hover:text-bg"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-2" />
          </span>
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em]">AI Stylist</span>
        </button>
      )}

      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity sm:bg-black/30 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeChat}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="AI 스타일리스트"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-line bg-bg transition-transform duration-300 sm:w-[440px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div>
            <p className="font-display text-sm font-bold tracking-wider">
              AI STYLIST <span className="ml-1 rounded bg-small/15 px-1.5 py-0.5 font-sans text-[10px] font-medium text-small">DEMO</span>
            </p>
            <p className="text-[11px] text-dim">리뷰 요약과 관련 리뷰만 근거로 답해요</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={reset} className="rounded px-2 py-1 text-xs text-muted hover:text-ink">
              새 대화
            </button>
            <button onClick={closeChat} aria-label="닫기" className="rounded px-2 py-1 text-lg leading-none text-muted hover:text-ink">
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="rise flex flex-col gap-4">
              <div className="rounded-2xl border border-line bg-surface p-4 text-sm leading-relaxed text-ink/90">
                안녕하세요! 찾는 상품이나 사이즈 고민을 말씀해 주세요.
                <p className="mt-2 text-xs text-muted">
                  정적 데모라서 실제 모델 대신 <b className="text-accent-2">녹화된 대화</b>를 재생하거나, 키워드 규칙으로 만든
                  <b className="text-small"> 오프라인 응답</b>을 보여줘요.
                </p>
              </div>
              <div>
                <p className="mb-2 font-display text-[10px] font-bold uppercase tracking-[0.25em] text-dim">녹화된 대화 재생</p>
                <div className="flex flex-col gap-2">
                  {chatDemos.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => playDemo(d.id)}
                      className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-left text-sm transition hover:border-accent/60"
                    >
                      <span>
                        {d.title}
                        <span className="mt-0.5 block text-[11px] text-dim">“{d.turns[0].user}”</span>
                      </span>
                      <span className="font-mono text-[10px] text-accent">▶ {d.turns.length} turns</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-5">
            {messages.map((m, i) => (
              <Message key={m.id} m={m} latest={i === messages.length - 1} />
            ))}
            {busy && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-1.5 pl-1" aria-label="답변 생성 중">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" style={{ animationDelay: `${i * 120}ms` }} />
                ))}
              </div>
            )}
          </div>
          <div ref={bottom} />
        </div>

        <form onSubmit={submit} className="border-t border-line p-3">
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 focus-within:border-accent">
            <input
              ref={input}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='예: 크게 나오는 원피스, "2번 단점이 뭐야?"'
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-ink placeholder:text-dim focus:outline-none focus-visible:outline-none"
              aria-label="메시지 입력"
            />
            <button
              type="submit"
              disabled={!text.trim() || busy}
              className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-bg transition disabled:opacity-30"
            >
              전송
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}
