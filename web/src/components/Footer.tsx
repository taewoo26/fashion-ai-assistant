import { meta, metrics } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-xs text-dim sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-display font-bold tracking-widest text-muted">AXIS//WEAR</span> · 포트폴리오용 데모
          쇼핑몰이에요. 실제 판매하지 않아요.
        </p>
        <p>
          데이터: {metrics.dataset.name} (McAuley Lab) · {meta.mode === "sample" ? "샘플 데이터" : `생성일 ${meta.generatedAt}`}
        </p>
      </div>
    </footer>
  );
}
