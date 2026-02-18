import type { FinancialRatios, HealthScore } from "./types";

function scoreMetric(
  value: number | undefined | null,
  excellent: number,
  good: number,
  caution: number,
  lowerIsBetter = false
): number {
  if (value === undefined || value === null || isNaN(value)) return 50;

  if (lowerIsBetter) {
    if (value <= excellent) return 100;
    if (value <= good) return 60 + ((good - value) / (good - excellent)) * 40;
    if (value <= caution) return 30 + ((caution - value) / (caution - good)) * 30;
    return Math.max(0, (1 - (value - caution) / caution) * 30);
  } else {
    if (value >= excellent) return 100;
    if (value >= good) return 60 + ((value - good) / (excellent - good)) * 40;
    if (value >= caution) return 30 + ((value - caution) / (good - caution)) * 30;
    return Math.max(0, (value / Math.max(caution, 0.001)) * 30);
  }
}

function liquidityScore(r: FinancialRatios): number {
  const scores: number[] = [];

  const cr = r.current_ratio ?? 1;
  if (cr >= 1.5 && cr <= 2.5) scores.push(100);
  else if (cr >= 1.0 && cr < 1.5) scores.push(60 + ((cr - 1) / 0.5) * 40);
  else if (cr < 1) scores.push(Math.max(0, (cr / 1) * 30));
  else scores.push(Math.max(70, 100 - (cr - 2.5) * 10));

  scores.push(scoreMetric(r.quick_ratio, 1.5, 1.0, 0.7));
  scores.push(scoreMetric(r.cash_ratio, 0.5, 0.2, 0.1));

  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function profitabilityScore(r: FinancialRatios): number {
  return (
    (scoreMetric(r.net_margin, 15, 8, 3) +
      scoreMetric(r.ebitda_margin, 20, 12, 6) +
      scoreMetric(r.gross_margin, 40, 25, 15) +
      scoreMetric(r.roe, 20, 12, 6) +
      scoreMetric(r.roa, 10, 5, 2)) /
    5
  );
}

function leverageScore(r: FinancialRatios): number {
  return (
    (scoreMetric(r.debt_to_equity, 0.5, 1.0, 2.0, true) +
      scoreMetric(r.interest_coverage, 5.0, 3.0, 2.0) +
      scoreMetric(r.dscr, 2.0, 1.5, 1.25) +
      scoreMetric(r.net_debt_to_ebitda, 1.0, 2.0, 3.0, true) +
      scoreMetric(r.debt_ratio, 0.3, 0.5, 0.65, true)) /
    5
  );
}

function efficiencyScore(r: FinancialRatios): number {
  return (
    (scoreMetric(r.dso, 45, 60, 90, true) +
      scoreMetric(r.dio, 30, 60, 90, true) +
      scoreMetric(r.ccc, 45, 75, 100, true) +
      scoreMetric(r.asset_turnover, 1.5, 1.0, 0.5) +
      scoreMetric(r.inventory_turnover, 12, 8, 4)) /
    5
  );
}

function cashFlowScore(r: FinancialRatios): number {
  const scores = [
    scoreMetric(r.ocf_margin, 15, 8, 3),
    scoreMetric(r.cf_to_debt, 0.3, 0.2, 0.1),
  ];
  const ccr = r.cash_conversion_ratio ?? 0;
  if (ccr >= 0.8) scores.push(100);
  else if (ccr >= 0.5) scores.push(60 + ((ccr - 0.5) / 0.3) * 40);
  else scores.push(Math.max(0, (ccr / 0.5) * 60));
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function complianceScore(flags: {
  tds_overdue: boolean;
  pf_esi_overdue: boolean;
  gst_itc_large: boolean;
  msme_overdue: boolean;
}): number {
  let score = 100;
  if (flags.tds_overdue) score -= 30;
  if (flags.pf_esi_overdue) score -= 30;
  if (flags.gst_itc_large) score -= 15;
  if (flags.msme_overdue) score -= 15;
  return Math.max(0, score);
}

export function calculateHealthScore(
  ratios: FinancialRatios,
  flags: {
    tds_overdue: boolean;
    pf_esi_overdue: boolean;
    gst_itc_large: boolean;
    msme_overdue: boolean;
  }
): HealthScore {
  const liq = liquidityScore(ratios);
  const prof = profitabilityScore(ratios);
  const lev = leverageScore(ratios);
  const eff = efficiencyScore(ratios);
  const cf = cashFlowScore(ratios);
  const comp = complianceScore(flags);

  const overall =
    liq * 0.2 +
    prof * 0.25 +
    lev * 0.2 +
    eff * 0.15 +
    cf * 0.1 +
    comp * 0.1;

  let zone: HealthScore["zone"] = "Critical";
  let zone_color: HealthScore["zone_color"] = "red";
  if (overall >= 80) { zone = "Excellent"; zone_color = "green"; }
  else if (overall >= 60) { zone = "Good"; zone_color = "yellow"; }
  else if (overall >= 40) { zone = "Caution"; zone_color = "orange"; }

  return {
    overall: parseFloat(overall.toFixed(1)),
    liquidity: parseFloat(liq.toFixed(1)),
    profitability: parseFloat(prof.toFixed(1)),
    leverage: parseFloat(lev.toFixed(1)),
    efficiency: parseFloat(eff.toFixed(1)),
    cash_flow: parseFloat(cf.toFixed(1)),
    compliance: parseFloat(comp.toFixed(1)),
    zone,
    zone_color,
  };
}
