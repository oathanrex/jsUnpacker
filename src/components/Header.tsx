import React from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { CODE_SAMPLES } from '../engine/samples';
import { ArrowLeft, Moon, Sun, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSelectSample: (sampleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onSelectSample,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-[var(--brand-surface)]/95 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <BrandLogo size={32} shape="circle" />
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold tracking-tight text-[var(--brand-fg)]">
              JSUnpacker
            </span>
            <span className="hidden rounded-full bg-[var(--brand-accent-soft)] px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-[var(--brand-accent-ink)] uppercase sm:inline-block">
              Studio v2.0
            </span>
          </div>
        </div>

        {/* Quick Test Samples */}
        <div className="hidden items-center gap-1.5 md:flex">
          <span className="flex items-center gap-1 font-mono text-xs text-[var(--brand-muted)]">
            <Sparkles className="h-3 w-3 text-[var(--brand-amber)]" />
            Samples:
          </span>
          {CODE_SAMPLES.slice(0, 4).map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample.id)}
              className="rounded-md border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] px-2 py-1 text-xs font-medium text-[var(--brand-muted)] transition-all hover:border-[var(--brand-accent)] hover:text-[var(--brand-fg)] hover:shadow-xs active:scale-95"
            >
              {sample.badge}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          {/* Privacy badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] px-2.5 py-1 text-xs text-[var(--brand-muted)] lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-mono text-[11px]">100% Client-Side</span>
          </div>

          {/* Back to Portfolio Link */}
          <a
            href="https://oathanrex.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] px-3 py-1.5 text-xs font-medium text-[var(--brand-fg)] transition-all hover:border-[var(--brand-border)] hover:bg-[var(--brand-surface)] hover:shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </a>

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--brand-border-subtle)] bg-[var(--brand-bg)] text-[var(--brand-fg)] transition-all hover:border-[var(--brand-border)] hover:bg-[var(--brand-surface)] active:scale-95"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[var(--brand-amber)]" />
            ) : (
              <Moon className="h-4 w-4 text-[var(--brand-fg)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
