import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatDrawer } from "@/components/chat/ChatDrawer";

export const metadata: Metadata = {
  title: "AXIS//WEAR — AI Fashion Store",
  description: "리뷰를 읽고 사이즈를 먼저 알려주는 AI 패션 쇼핑몰 데모 (추천 · 의미 검색 · LLM 리뷰 요약 · RAG 챗봇)",
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Noto+Sans+KR:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <ChatProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <ChatDrawer />
        </ChatProvider>
      </body>
    </html>
  );
}
