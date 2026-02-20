"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Lock,
  FileText,
  Image,
  Table2,
  Sparkles,
  HeartPulse,
  ChevronRight,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { FinancialData } from "@/lib/types";

const ACCEPTED_TYPES =
  "image/*,.pdf,.xlsx,.xls,.csv,.txt,.doc,.docx";

const FEATURES = [
  "Balance Sheet, P&L, Cash Flow — any format",
  "Photos of statements, scanned PDFs, Tally exports",
  "Indian-specific: GST, TDS, PF/ESI, MSME, CC/OD",
  "9 deep-dive sections + compliance health monitor",
  "Year-over-year comparison with delta analysis",
  "Recommendations with estimated impact",
];

export default function HomePage() {
  const router = useRouter();
  const { setIsAnalyzing, setError, processExtractedData } = useAppStore();

  const [localKey, setLocalKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState("");
  const [keyError, setKeyError] = useState("");

  const analyze = useCallback(
    async (file: File) => {
      const key = localKey.trim();
      if (!key) {
        setKeyError("Please enter your OpenAI API key to analyze documents.");
        return;
      }
      setKeyError("");

      setAnalyzing(true);
      setIsAnalyzing(true);
      setAnalyzeStep("Reading your document…");

      try {
        const formData = new FormData();
        formData.append("file", file);

        setAnalyzeStep("Sending to GPT-4o for analysis…");

        const headers: Record<string, string> = {};
        if (key) headers["x-openai-key"] = key;

        const res = await fetch("/api/analyze", {
          method: "POST",
          headers,
          body: formData,
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Analysis failed");
        }

        setAnalyzeStep("Calculating ratios and health score…");

        const extracted = json.data as FinancialData;
        processExtractedData(extracted);

        setAnalyzeStep("Ready! Opening dashboard…");
        await new Promise((r) => setTimeout(r, 600));

        setIsAnalyzing(false);
        router.push("/dashboard");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Analysis failed";
        setError(msg);
        setKeyError(msg);
        setAnalyzing(false);
        setIsAnalyzing(false);
        setAnalyzeStep("");
      }
    },
    [localKey, setIsAnalyzing, setError, processExtractedData, router]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setUploadedFile(acceptedFiles[0]);
        analyze(acceptedFiles[0]);
      }
    },
    [analyze]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: analyzing,
  });

  const loadSample = async () => {
    setAnalyzing(true);
    setAnalyzeStep("Loading sample data…");
    try {
      const res = await fetch("/api/sample");
      const json = await res.json();
      processExtractedData(json.data as FinancialData);
      setAnalyzeStep("Ready!");
      await new Promise((r) => setTimeout(r, 400));
      router.push("/dashboard");
    } catch {
      setAnalyzing(false);
      setAnalyzeStep("");
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5" style={{ color: "var(--accent)" }} />
            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              Financial Health Calculator
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-medium"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
              India
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <span>Ind AS / Companies Act 2013 / Schedule III</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Hero */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
              <Sparkles className="w-3 h-3" />
              GPT-4o Vision — Reads Any Document
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: "var(--text-primary)" }}>
              Company Financial<br />
              <span style={{ color: "var(--accent)" }}>Health Dashboard</span>
            </h1>

            <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
              Upload any financial document — photo, PDF, Excel, Tally export —
              and get a complete financial health analysis in seconds.
              Built specifically for Indian businesses.
            </p>

            <div className="space-y-3 mb-10">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Supported formats */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Image, label: "Photos / Screenshots" },
                { icon: FileText, label: "PDF Documents" },
                { icon: Table2, label: "Excel / CSV / Tally" },
              ].map(({ icon: Icon, label }) => (
                <div key={label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border"
                  style={{ borderColor: "var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)" }}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Upload card */}
          <div>
            <div className="rounded-xl border p-8 shadow-card"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}>

              {/* API Key input */}
              <div className="mb-6">
                <label className="block text-xs font-medium mb-2 flex items-center gap-1.5"
                  style={{ color: "var(--text-secondary)" }}>
                  <Lock className="w-3 h-3" />
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={localKey}
                    onChange={(e) => { setLocalKey(e.target.value); setKeyError(""); }}
                    placeholder="sk-..."
                    className="w-full text-sm px-3 py-2.5 pr-10 rounded-lg border outline-none focus:ring-2 transition-all"
                    style={{
                      borderColor: keyError ? "#FECDD3" : "var(--border)",
                      background: "var(--bg-base)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}>
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {keyError && (
                  <p className="text-xs mt-1.5" style={{ color: "#9F1239" }}>{keyError}</p>
                )}
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  Your key is only used for analysis and never stored on any server.
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer"
                    className="ml-1 underline" style={{ color: "var(--accent)" }}>
                    Get a key →
                  </a>
                </p>
              </div>

              {/* Drop zone */}
              <AnimatePresence mode="wait">
                {analyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border-2 border-dashed p-12 text-center"
                    style={{ borderColor: "var(--accent)", background: "var(--accent-light)" }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-10 h-10 border-2 border-t-transparent rounded-full mx-auto mb-4"
                      style={{ borderColor: "var(--accent)" }}
                    />
                    <p className="font-medium text-sm mb-1" style={{ color: "var(--accent)" }}>
                      Analyzing…
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{analyzeStep}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}>
                  <div
                    {...getRootProps()}
                    className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${isDragActive ? "drop-active" : ""}`}
                    style={{
                      borderColor: isDragActive ? "var(--accent)" : "var(--border)",
                      background: isDragActive ? "var(--accent-light)" : "var(--bg-subtle)",
                    }}>
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-4" style={{ color: isDragActive ? "var(--accent)" : "var(--text-muted)" }} />
                    <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      {isDragActive ? "Drop to analyze" : "Drop any financial document here"}
                    </p>
                    <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                      or click to browse — PDF, image, Excel, CSV, screenshot, anything
                    </p>
                    <span className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white"
                      style={{ background: "var(--accent)" }}>
                      <Upload className="w-4 h-4" />
                      Upload & Analyze
                    </span>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sample data */}
              {!analyzing && (
                <div className="mt-4 text-center">
                  <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>No document handy?</p>
                  <button
                    onClick={loadSample}
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                    style={{ color: "var(--accent)" }}>
                    Try with sample company data
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer note */}
            <p className="text-xs mt-4 text-center" style={{ color: "var(--text-muted)" }}>
              Supports Ind AS / Companies Act 2013 / Schedule III / Tally / Zoho / SAP / MCA formats
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
