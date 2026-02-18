"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useAppStore } from "@/lib/store";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { analysis } = useAppStore();

  useEffect(() => {
    if (!analysis) {
      router.push("/");
    }
  }, [analysis, router]);

  if (!analysis) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <Navbar />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
