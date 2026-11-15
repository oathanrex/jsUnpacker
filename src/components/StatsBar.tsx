import React from 'react';
import { ShieldCheck, Cpu, Terminal, ExternalLink } from 'lucide-react';
import type { UnpackResult } from '../engine/types';

interface StatsBarProps {
  result: UnpackResult | null;
}

export const StatsBar: React.FC<StatsBarProps> = ({ result }) => {
  return (
    <footer className="border-t border-[var(--brand-border)] bg-[var(--brand-surface)] px-4 py-2 font-mono text-xs text-[var(--brand-muted)] transition-colors duration-150">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Left: Execution metrics */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-500">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-sans text-[11px] font-medium text-[var(--brand-fg)]">
              Zero Server Uploads (100% Local Browser Engine)
            </span>
          </div>

          <span className="hidden text-[var(--brand-border)] sm:inline">|</span>

          <div className="hidden items-center gap-1.5 sm:flex">
            <Cpu className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
            <span>AST Deobfuscator Engine v2.0</span>
          </div>
        </div>

        {/* Right: Shortcuts & Author link */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="hidden lg:flex items-center gap-2">
            <span>Shortcuts:</span>
            <kbd className="rounded border border-[var(--brand-border)] bg-[var(--brand-bg)] px-1.5 py-0.5">Ctrl+Enter</kbd>
            <span>Unpack</span>
          </div>

          <a
            href="https://github.com/oathanrex"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--brand-muted)] hover:text-[var(--brand-fg)] transition-colors"
          >
            <span>@oathanrex</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
};
