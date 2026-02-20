"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FullAnalysis, ViewMode } from "./types";
import { calculateRatios, deriveBS, derivePL } from "./calculator";
import { calculateHealthScore } from "./scorer";
import { generateRecommendations } from "./recommender";
import type { FinancialData } from "./types";

interface AppStore {
  analysis: FullAnalysis | null;
  viewMode: ViewMode;
  isAnalyzing: boolean;
  error: string | null;
  apiKey: string;

  setApiKey: (key: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsAnalyzing: (v: boolean) => void;
  setError: (e: string | null) => void;
  processExtractedData: (data: FinancialData) => void;
  clearAnalysis: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      analysis: null,
      viewMode: "cfo",
      isAnalyzing: false,
      error: null,
      apiKey: "",

      setApiKey: (key) => set({ apiKey: key }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setIsAnalyzing: (v) => set({ isAnalyzing: v }),
      setError: (e) => set({ error: e }),

      processExtractedData: (data: FinancialData) => {
        const prevData =
          data.previous_year_balance_sheet && data.previous_year_profit_loss
            ? ({
                ...data,
                balance_sheet: data.previous_year_balance_sheet,
                profit_loss: data.previous_year_profit_loss,
                cash_flow: data.previous_year_cash_flow || data.cash_flow,
                financial_year: data.previous_financial_year || "",
              } as FinancialData)
            : null;

        const ratios = calculateRatios(data, prevData);
        const prevRatios = prevData ? calculateRatios(prevData) : null;

        const bs = data.balance_sheet;
        const pl = data.profit_loss;
        const rev = pl.revenue_from_operations;
        const flags = {
          tds_overdue: bs.tds_payable > 0,
          pf_esi_overdue: bs.pf_esi_payable > 0,
          gst_itc_large: rev > 0 && bs.gst_itc_receivable > (rev / 12) * 3,
          msme_overdue: data.msme_payables > 0,
        };

        const healthScore = calculateHealthScore(ratios, flags);

        const compliance = {
          gst_filing: "UNKNOWN" as const,
          gst_itc_blocked: flags.gst_itc_large ? "WARNING" as const : "OK" as const,
          tds_deposited: flags.tds_overdue ? "CRITICAL" as const : "OK" as const,
          advance_tax: "UNKNOWN" as const,
          pf_esi: flags.pf_esi_overdue ? "CRITICAL" as const : "OK" as const,
          roc_filing: "UNKNOWN" as const,
          msme_payments: flags.msme_overdue ? "WARNING" as const : "OK" as const,
          related_party: data.promoter_loans > 0 ? "WARNING" as const : "OK" as const,
        };

        const recommendations = generateRecommendations(data, ratios, prevRatios);

        const d = { ...deriveBS(bs), ...derivePL(pl) };
        const prevDerived = prevData
          ? { ...deriveBS(prevData.balance_sheet), ...derivePL(prevData.profit_loss) }
          : null;

        set({
          analysis: {
            data,
            derived: d,
            prev_derived: prevDerived,
            ratios,
            prev_ratios: prevRatios,
            health_score: healthScore,
            recommendations,
            compliance,
          },
          error: null,
        });
      },

      clearAnalysis: () => set({ analysis: null, error: null }),
    }),
    {
      name: "financial-health-store",
      // Only persist viewMode — never persist the API key so users
      // must enter their own key every session.
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
);
