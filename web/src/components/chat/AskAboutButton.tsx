"use client";

import { PRODUCT_QUESTIONS, useChat } from "./ChatProvider";

export function AskAboutButton({ productId }: { productId: string }) {
  const { askAbout, send } = useChat();
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="mb-3 text-sm font-medium">AI 스타일리스트에게 이 상품 물어보기</p>
      <div className="flex flex-wrap gap-2">
        {PRODUCT_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => {
              askAbout(productId);
              window.setTimeout(() => send(`1번 ${q}`), 50);
            }}
            className="rounded-full border border-line px-3.5 py-1.5 text-xs text-muted transition hover:border-accent hover:text-accent"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
