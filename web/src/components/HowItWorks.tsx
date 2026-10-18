import { metrics } from "@/lib/data";
import type { QType } from "@/lib/types";

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

const QTYPE_KO: Record<QType, string> = {
  simple: "짧은 검색어",
  attribute: "소재·색·핏",
  occasion: "상황·계절",
  size: "사이즈 조건",
  english: "영어",
};
const QTYPE_ORDER: QType[] = ["simple", "attribute", "occasion", "size", "english"];

/** 검색어 유형 하나: before(회색) / after(강조) 막대 두 개 */
function PairBar({ label, n, before, after }: { label: string; n: number; before: number; after: number }) {
  const row = (v: number, highlight: boolean) => (
    <div className="grid grid-cols-[1fr_2.5rem] items-center gap-2">
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${highlight ? "bg-gradient-to-r from-accent to-accent-2" : "bg-dim"}`}
          style={{ width: `${Math.max(v * 100, 2)}%` }}
        />
      </div>
      <span className={`text-right font-mono ${highlight ? "text-accent-2" : "text-muted"}`}>{v.toFixed(2)}</span>
    </div>
  );
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-xs sm:grid-cols-[8rem_1fr]">
      <span className="text-ink">
        {label} <span className="font-mono text-[10px] text-dim">{n}개</span>
      </span>
      <div className="flex flex-col gap-1">
        {row(before, false)}
        {row(after, true)}
      </div>
    </div>
  );
}

type Step = { no: string; title: string; desc: string; metric: string; metricLabel: string };

function StepGrid({ label, steps, className }: { label: string; steps: Step[]; className: string }) {
  return (
    <div>
      <div className="mb-3 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-dim">{label}</div>
      <ol className={`grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 ${className}`}>
        {steps.map((s, i) => (
          <li
            key={s.no}
            className={`flex flex-col gap-3 bg-bg p-5 ${
              // sm 2열에서 마지막 카드가 혼자 남으면 빈 칸이 보이지 않게 넓혀요
              steps.length % 2 === 1 && i === steps.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
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
    </div>
  );
}

export function HowItWorks() {
  const m = metrics;
  const content = m.recommendation.find((r) => r.coldRecall10 > 0);
  const bestCf = Math.max(...m.recommendation.filter((r) => r.coldRecall10 === 0).map((r) => r.recall10));
  const qu = m.queryUnderstanding;

  const ev = m.evaluation; // v2 JSON에만 있어요

  const buildSteps: Step[] = [
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
    ev
      ? {
          no: "05",
          title: "RAG Chatbot",
          desc: "검색어 이해 → 필터 + 의미 검색 → 근거 기반 답변",
          metric: pct(m.groundedness.supportedRate, 0),
          metricLabel: "답변 근거성",
        }
      : {
          no: "05",
          title: "RAG Chatbot",
          desc: "검색어 이해 → 필터 + 의미 검색 → 근거 기반 답변",
          metric: `${qu[0].categoryP5.toFixed(2)} → ${qu[qu.length - 1].categoryP5.toFixed(2)}`,
          metricLabel: "카테고리 정확도@5",
        },
  ];
  if (ev) {
    buildSteps.push({
      no: "06",
      title: "Web Demo",
      desc: "Next.js 정적 배포 · 배치 추론 결과 서빙",
      metric: `${(m.latency.medianMs / 1000).toFixed(1)}s`,
      metricLabel: "챗봇 응답 중앙값",
    });
  }

  const nQueries = ev ? ev.search.nQueries.dev + ev.search.nQueries.test : 0;
  const measureSteps: Step[] = ev
    ? [
        {
          no: "07",
          title: "Eval Set",
          desc: `검색어 ${nQueries}개 · 사이즈 정답 ${ev.size.nGold}개 직접 검토/라벨링`,
          metric: `${nQueries} · ${ev.size.nGold}`,
          metricLabel: "검색어 · 사이즈 정답",
        },
        {
          no: "08",
          title: "Size Label v2",
          desc: "LLM은 읽기, 코드는 세기·판단",
          metric: `${pct(ev.size.before, 0)} → ${pct(ev.size.after, 0)}`,
          metricLabel: "사이즈 정확도 (test)",
        },
        {
          no: "09",
          title: "Korean Search",
          desc: "LLM 검색어 재작성 + 벡터·BM25 하이브리드",
          metric: `${ev.search.before.toFixed(2)} → ${ev.search.after.toFixed(2)}`,
          metricLabel: "카테고리 정확도@5 (test)",
        },
      ]
    : [];

  const sizeGap = ev ? Math.round((ev.size.after - ev.size.rule04) * 1000) / 10 : 0;
  const qtypes = ev
    ? [...ev.search.byQtype].sort((a, b) => QTYPE_ORDER.indexOf(a.qtype) - QTYPE_ORDER.indexOf(b.qtype))
    : [];

  const recMax = Math.max(...m.recommendation.map((r) => r.recall10));

  return (
    <section id="core" className="relative scroll-mt-16 border-t border-line bg-surface/40 py-24">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.35em] text-accent">Behind the AI</span>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">이 쇼핑몰 뒤에서 돌아가는 {ev ? 9 : 5}단계</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          {ev
            ? "Colab 노트북 9개로 만든 파이프라인이에요. 만들고(01~06), 재고(07), 고쳤어요(08~09)."
            : "Colab 노트북 5개로 만든 파이프라인이에요. 각 단계의 한계가 다음 단계를 만든 이유가 됐어요."}
        </p>

        {ev ? (
          <div className="mt-12 flex flex-col gap-8">
            <StepGrid label="Build · 01–06" steps={buildSteps} className="lg:grid-cols-3" />
            <StepGrid label="Measure & Improve · 07–09" steps={measureSteps} className="lg:grid-cols-3" />
          </div>
        ) : (
          <div className="mt-12">
            <StepGrid label="Build · 01–05" steps={buildSteps} className="lg:grid-cols-5" />
          </div>
        )}

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
            {ev ? (
              <>
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Evaluation · test 세트로 한 번만 측정
                </h3>
                <p className="mt-1 text-xs text-dim">
                  검색: test 검색어 {ev.search.nQueries.test}개, 상위 5개 중 카테고리가 맞는 비율
                </p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-dim">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-4 rounded-full bg-dim" /> 한국어 원문 검색
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-4 rounded-full bg-gradient-to-r from-accent to-accent-2" /> 영어 재작성 + 하이브리드
                  </span>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  {qtypes.map((q) => (
                    <PairBar key={q.qtype} label={QTYPE_KO[q.qtype] ?? q.qtype} n={q.n} before={q.before} after={q.after} />
                  ))}
                </div>

                <p className="mt-6 border-t border-line pt-5 text-xs text-dim">사이즈: 정답 {ev.size.nTest}개(test) 기준 정확도</p>
                <div className="mt-4 flex flex-col gap-3">
                  <Bar label="04 LLM" value={ev.size.before} max={1} suffix={pct(ev.size.before, 0)} />
                  <Bar label="04 규칙" value={ev.size.rule04} max={1} suffix={pct(ev.size.rule04, 0)} />
                  <Bar label="08 최종" value={ev.size.after} max={1} highlight suffix={pct(ev.size.after, 0)} />
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-dim">
                  {sizeGap === 0
                    ? "08 최종(규칙 v2)은 test에서 04 규칙과 같은 점수라, 단순 규칙보다 낫다고 말할 수는 없어요. 대신 근거를 개수로 보여줄 수 있게 됐어요."
                    : `08 최종(규칙 v2)은 test에서 04 규칙보다 ${Math.abs(sizeGap)}%p ${sizeGap > 0 ? "높아요" : "낮아요"}. 정답이 ${ev.size.nTest}개뿐이라 차이는 조심해서 봐야 해요.`}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">Query Understanding · 카테고리 정확도@5</h3>
                <p className="mt-1 text-xs text-dim">한국어 검색어 10개, 상위 5개 결과의 상품 종류가 맞는 비율</p>
                <div className="mt-6 flex flex-col gap-3">
                  {qu.map((q, i) => (
                    <Bar key={q.method} label={q.method} value={q.categoryP5} max={1} highlight={i > 0} suffix={q.categoryP5.toFixed(2)} />
                  ))}
                </div>
              </>
            )}
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
