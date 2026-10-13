"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { chatDemos } from "@/lib/data";
import { offlineReply } from "@/lib/offline-assistant";
import type { ParsedQuery } from "@/lib/types";

export type ChatMessage =
  | { id: number; role: "user"; text: string }
  | {
      id: number;
      role: "assistant";
      source: "recorded" | "offline" | "system";
      parsed?: ParsedQuery;
      products: string[];
      numbers: number[];
      answer: string;
      latencyMs?: number;
      suggestions?: string[];
    };

type NewMessage = ChatMessage extends infer M ? (M extends ChatMessage ? Omit<M, "id"> : never) : never;

interface ChatState {
  open: boolean;
  busy: boolean;
  messages: ChatMessage[];
  openChat: () => void;
  closeChat: () => void;
  reset: () => void;
  send: (text: string) => void;
  playDemo: (demoId: string) => void;
  askAbout: (productId: string) => void;
}

const Ctx = createContext<ChatState | null>(null);

export const PRODUCT_QUESTIONS = ["사이즈 어때?", "단점이 뭐야?", "소재나 착용감은 어때?", "한국으로 배송돼?"];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const lastShown = useRef<string[]>([]);
  const timers = useRef<number[]>([]);
  const seq = useRef(0);

  const push = useCallback((m: NewMessage) => {
    seq.current += 1;
    const msg = { ...m, id: seq.current } as ChatMessage;
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const reset = useCallback(() => {
    clearTimers();
    lastShown.current = [];
    setBusy(false);
    setMessages([]);
  }, []);

  const send = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t || busy) return;
      push({ role: "user", text: t });
      setBusy(true);
      timers.current.push(
        window.setTimeout(() => {
          const r = offlineReply(t, lastShown.current);
          if (r.parsed.intent === "search" && r.products.length) lastShown.current = r.products;
          push({ role: "assistant", source: "offline", ...r });
          setBusy(false);
        }, 550),
      );
    },
    [busy, push],
  );

  const playDemo = useCallback(
    (demoId: string) => {
      const demo = chatDemos.find((d) => d.id === demoId);
      if (!demo) return;
      clearTimers();
      setBusy(true);
      let t = 150;
      demo.turns.forEach((turn, i) => {
        timers.current.push(window.setTimeout(() => push({ role: "user", text: turn.user }), t));
        t += 700;
        timers.current.push(
          window.setTimeout(() => {
            if (turn.parsed.intent === "search") lastShown.current = turn.products;
            push({
              role: "assistant",
              source: "recorded",
              parsed: turn.parsed,
              products: turn.products,
              numbers: turn.numbers,
              answer: turn.answer,
              latencyMs: turn.latencyMs,
            });
            if (i === demo.turns.length - 1) setBusy(false);
          }, t),
        );
        t += Math.min(4200, 900 + turn.answer.length * 22);
      });
    },
    [push],
  );

  const askAbout = useCallback(
    (productId: string) => {
      clearTimers();
      setBusy(false);
      lastShown.current = [productId];
      setOpen(true);
      push({
        role: "assistant",
        source: "system",
        products: [productId],
        numbers: [1],
        answer: "이 상품에 대해 궁금한 점을 물어보세요. 리뷰 요약을 근거로 답해 드려요.",
        suggestions: PRODUCT_QUESTIONS.map((q) => `1번 ${q}`),
      });
    },
    [push],
  );

  useEffect(() => () => clearTimers(), []);

  return (
    <Ctx.Provider
      value={{
        open,
        busy,
        messages,
        openChat: () => setOpen(true),
        closeChat: () => setOpen(false),
        reset,
        send,
        playDemo,
        askAbout,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useChat() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useChat must be used inside ChatProvider");
  return c;
}
