import { metrics } from "@/lib/data";

const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;

function Bar({ label, value, max, highlight, suffix }: { label: string; value: number; max: number; highlight?: boolean; suffix: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-xs sm:grid-cols-[9rem_1fr_4rem]">
      <span className={highlight ? "text-ink" : "text-muted"}>{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${highlight ? "bg-gradient-to-r from-accent to-accent-2" : "bg-dim"}`}
          style={{ width: `${Math.max((value / max) * 100, 2)}%` }}
        />
      </div>
      <span className={`text-right font-mono ${highlight ? "text-accent-2" : "text-muted"}`}>{suffix}</span>
    </div>
  );
}

export function HowItWorks() {
  const m = metrics;
  const content = m.recommendation.find((r) => r.coldRecall10 > 0);
  const bestCf = Math.max(...m.recommendation.filter((r) => r.coldRecall10 === 0).map((r) => r.recall10));
  const qu = m.queryUnderstanding;

  const steps = [
    {
      no: "01",
      title: "EDA",
      desc: "데이터가 얼마나 희소한지부터 확인",
      metric: pct(m.dataset.singleReviewUserRate),
      metricLabel: "리뷰를 1개만 쓴 유저",
    },
    {
      no: "02",
      title: "Recommendation",
      desc: "인기 · ItemCF · ALS 비교, 기록 길이별 하이브리드",
      metric: pct(bestCf, 2),
      metricLabel: "CF 최고 Recall@10",
    },
    {
      no: "03",
      title: "Semantic Search",
      desc: "다국어 임베딩 + FAISS로 한국어 검색, 콜드 스타트 대응",
      metric: content ? pct(content.coldRecall10, 2) : "-",
      metricLabel: "신상품 Recall@10 (CF는 0%)",
    },
    {
      no: "04",
      title: "LLM Review Summary",
      desc: "Gemini 구조화 출력으로 장단점 · 사이즈 핏 추출",
      metric: pct(m.summary.supportedRate),
      metricLabel: "리뷰에 근거 있는 주장",
    },
    {
      no: "05",
      title: "RAG Chatbot",
      desc: "검색어 이해 → 필터 + 의미 검색 → 근거 기반 답변",
      metric: `${qu[0].categoryP5.toFixed(2)} → ${qu[qu.length - 1].categoryP5.toFixed(2)}`,
      metricLabel: "카테고리 정확도@5",
    },
  ];

  const recMax = Math.max(...m.recommendation.map((r) => r.recall10));

  return (
    <section id="core" className="relative scroll-mt-16 border-t border-line bg-surface/40 py-24">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-accent">Behind the AI</span>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">이 쇼핑몰 뒤에서 돌아가는 5단계</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Colab 노트북 5개로 만든 파이프라인이에요. 각 단계의 한계가 다음 단계를 만든 이유가 됐어요.
        </p>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((s) => (
            <li key={s.no} className="flex flex-col gap-3 bg-bg p-5">
              <span className="font-display text-xs font-bold text-dim">{s.no}</span>
              <h3 className="font-display text-sm font-bold tracking-wide">{s.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{s.desc}</p>
              <div className="mt-auto pt-4">
                <div className="font-display text-2xl font-bold text-accent-2">{s.metric}</div>
                <div className="mt-1 text-[11px] text-dim">{s.metricLabel}</div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-bg p-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">Recall@10 · 다음 구매 맞히기</h3>
            <p className="mt-1 text-xs text-dim">유저 {m.dataset.users.toLocaleString()}명의 마지막 구매를 숨기고 상위 10개 추천에 들어갔는지</p>
            <div className="mt-6 flex flex-col gap-3">
              {m.recommendation.map((r) => (
                <Bar key={r.model} label={r.model} value={r.recall10} max={recMax} highlight={r.coldRecall10 > 0} suffix={pct(r.recall10, 2)} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-bg p-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">Query Understanding · 카테고리 정확도@5</h3>
            <p className="mt-1 text-xs text-dim">한국어 검색어 10개, 상위 5개 결과의 상품 종류가 맞는 비율</p>
            <div className="mt-6 flex flex-col gap-3">
              {qu.map((q, i) => (
                <Bar key={q.method} label={q.method} value={q.categoryP5} max={1} highlight={i > 0} suffix={q.categoryP5.toFixed(2)} />
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-xs">
              <div>
                <div className="font-display text-lg font-bold">{pct(m.groundedness.supportedRate, 0)}</div>
                <div className="text-dim">챗봇 답변 근거성 ({m.groundedness.n}개 주장)</div>
              </div>
              <div>
                <div className="font-display text-lg font-bold">{pct(m.groundedness.unknownAdmitRate, 0)}</div>
                <div className="text-dim">모르는 질문에 "확인되지 않아요"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
