"use client";
import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import type { TooltipContent } from "@/lib/types";

interface Props {
  content: TooltipContent;
  children?: React.ReactNode;
}

export function MetricTooltip({ content, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const show = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: Math.min(rect.left + window.scrollX, window.innerWidth - 340),
      });
    }
    setVisible(true);
  };

  useEffect(() => {
    const hide = () => setVisible(false);
    if (visible) {
      document.addEventListener("click", hide);
      document.addEventListener("keydown", (e) => e.key === "Escape" && hide());
    }
    return () => document.removeEventListener("click", hide);
  }, [visible]);

  return (
    <span className="relative inline-flex items-center">
      {children}
      <button
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={() => setVisible(false)}
        onClick={(e) => { e.stopPropagation(); setVisible(!visible); }}
        className="ml-1 inline-flex items-center"
        aria-label={`Info: ${content.full_name}`}
        style={{ color: "var(--text-muted)" }}>
        <Info className="w-3.5 h-3.5" />
      </button>

      {visible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 tooltip-dark"
          style={{ top: pos.top, left: pos.left, maxWidth: 320 }}
          onMouseEnter={show}
          onMouseLeave={() => setVisible(false)}>
          <p className="font-semibold mb-2" style={{ fontSize: 13 }}>{content.full_name}</p>

          {content.formula && (
            <div className="mb-2">
              <p className="font-medium text-gray-400 uppercase tracking-wide mb-0.5" style={{ fontSize: 10 }}>Formula</p>
              <p className="font-mono text-xs" style={{ color: "#98C1D9" }}>{content.formula}</p>
            </div>
          )}

          <div className="mb-2">
            <p className="font-medium text-gray-400 uppercase tracking-wide mb-0.5" style={{ fontSize: 10 }}>Plain English</p>
            <p className="leading-relaxed" style={{ fontSize: 12 }}>{content.plain_english}</p>
          </div>

          <div className="mb-2">
            <p className="font-medium text-gray-400 uppercase tracking-wide mb-0.5" style={{ fontSize: 10 }}>What it Signifies</p>
            <p className="leading-relaxed" style={{ fontSize: 12, color: "#D6D3D1" }}>{content.signifies}</p>
          </div>

          {content.indian_context && (
            <div className="mb-2">
              <p className="font-medium text-gray-400 uppercase tracking-wide mb-0.5" style={{ fontSize: 10 }}>🇮🇳 Indian Context</p>
              <p className="leading-relaxed" style={{ fontSize: 12, color: "#FED7AA" }}>{content.indian_context}</p>
            </div>
          )}

          {content.healthy_range && (
            <div className="pt-2 mt-2 border-t border-gray-700">
              <p className="font-medium text-gray-400 uppercase tracking-wide mb-0.5" style={{ fontSize: 10 }}>Healthy Range</p>
              <p className="font-medium" style={{ fontSize: 12, color: "#BBF7D0" }}>{content.healthy_range}</p>
            </div>
          )}
        </div>
      )}
    </span>
  );
}

interface SimpleTooltipProps {
  text: string;
  children: React.ReactNode;
}

export function SimpleTooltip({ text, children }: SimpleTooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap z-50"
          style={{ background: "#1C1917", color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
          {text}
        </div>
      )}
    </span>
  );
}
