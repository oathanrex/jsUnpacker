import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  AlignLeft,
  WrapText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sparkles,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import type { UnpackResult } from '../engine/types';

interface OutputPaneProps {
  result: UnpackResult | null;
  onBeautify: () => void;
  originalCode: string;
  onSwitchToInput?: () => void;
  onCopyOutputToInput?: () => void;
}

export const OutputPane: React.FC<OutputPaneProps> = ({
  result,
  onBeautify,
  originalCode,
  onSwitchToInput,
  onCopyOutputToInput,
}) => {
  const [copied, setCopied] = useState(false);
  const [wrapLines, setWrapLines] = useState(true);
  const [viewTab, setViewTab] = useState<'code' | 'diff'>('code');

  const outputText = result ? result.output : '';
  const lines = outputText ? outputText.split('\n').length : 1;
  const chars = outputText.length;

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unpacked-${result?.detectedType || 'script'}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full border border-[var(--brand-border)] bg-[var(--brand-surface)] rounded-xl overflow-hidden shadow-xs">
      {/* Pane Header */}
      <div className="flex items-center justify-between border-b border-[var(--brand-border)] bg-[var(--brand-bg)]/80 px-2.5 sm:px-3 py-2 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setViewTab('code')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewTab === 'code'
                ? 'bg-[var(--brand-surface)] text-[var(--brand-fg)] shadow-xs'
                : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
            <span>Clean Code</span>
          </button>

          <button
            onClick={() => setViewTab('diff')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              viewTab === 'diff'
                ? 'bg-[var(--brand-surface)] text-[var(--brand-fg)] shadow-xs'
                : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Diff</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={() => setWrapLines(!wrapLines)}
            title={wrapLines ? 'Disable line wrap' : 'Enable line wrap'}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              wrapLines
                ? 'bg-[var(--brand-accent-soft)] text-[var(--brand-accent-ink)]'
                : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)] hover:bg-[var(--brand-border-subtle)]'
            }`}
          >
            <WrapText className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onBeautify}
            title="Re-format & Beautify"
            disabled={!outputText}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--brand-muted)] hover:text-[var(--brand-fg)] hover:bg-[var(--brand-border-subtle)] transition-all disabled:opacity-40 cursor-pointer"
          >
            <AlignLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Format</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!outputText}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                : 'border border-[var(--brand-border-subtle)] bg-[var(--brand-surface)] text-[var(--brand-fg)] hover:border-[var(--brand-border)] hover:shadow-xs disabled:opacity-40'
            }`}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!outputText}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded text-xs font-semibold bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] hover:bg-[var(--brand-accent-hover)] transition-all shadow-xs disabled:opacity-40 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Error or Warning Notification */}
      {result?.error && (
        <div className="flex items-start gap-2 bg-amber-500/10 border-b border-amber-500/20 px-3 py-2 text-xs text-amber-500">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Notice: {result.error}. Fallback AST cleanup applied.</span>
        </div>
      )}

      {/* Pane Content */}
      <div className="relative flex-1 min-h-[360px] lg:min-h-[500px] overflow-auto">
        {viewTab === 'code' && (
          <div className="flex h-full w-full">
            {/* Line numbers column */}
            <div className="select-none bg-[var(--brand-bg)]/40 border-r border-[var(--brand-border-subtle)] py-3 px-2 font-mono text-xs text-[var(--brand-muted)]/50 text-right min-w-[36px] sm:min-w-[42px] overflow-hidden">
              {Array.from({ length: Math.min(lines, 1000) }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Output code display */}
            <div className="flex-1 p-3 overflow-auto">
              <pre
                className={`font-mono text-xs leading-6 text-[var(--brand-fg)] selection:bg-[var(--brand-accent)]/20 ${
                  wrapLines ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
                }`}
              >
                <code>{outputText || '// Deobfuscated JavaScript code will appear here...'}</code>
              </pre>
            </div>
          </div>
        )}

        {viewTab === 'diff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-y md:divide-y-0 md:divide-x divide-[var(--brand-border)]">
            <div className="p-3 overflow-auto">
              <div className="mb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--brand-muted)]">
                Original Input ({originalCode.length} chars)
              </div>
              <pre className="font-mono text-xs leading-5 text-[var(--brand-muted)] whitespace-pre-wrap break-all opacity-80">
                <code>{originalCode || '// Empty input'}</code>
              </pre>
            </div>
            <div className="p-3 overflow-auto bg-[var(--brand-bg)]/30">
              <div className="mb-2 text-[10px] font-mono uppercase tracking-wider text-[var(--brand-accent)]">
                Unpacked Clean Code ({outputText.length} chars)
              </div>
              <pre className="font-mono text-xs leading-5 text-[var(--brand-fg)] whitespace-pre-wrap break-all">
                <code>{outputText || '// No unpacked output yet'}</code>
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Pane Footer Stats & Mobile Actions */}
      <div className="flex flex-wrap items-center justify-between border-t border-[var(--brand-border-subtle)] bg-[var(--brand-bg)]/60 px-2.5 sm:px-3 py-1.5 font-mono text-[11px] text-[var(--brand-muted)] gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {result?.detectedType && (
            <span className="inline-flex items-center gap-1 rounded bg-[var(--brand-accent-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand-accent-ink)] uppercase">
              <CheckCircle2 className="h-3 w-3" />
              {result.detectedType}
            </span>
          )}
          <span>{lines.toLocaleString()}L · {chars.toLocaleString()}C</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick mobile jump to input */}
          {onSwitchToInput && (
            <button
              onClick={onSwitchToInput}
              className="lg:hidden flex items-center gap-1 rounded border border-[var(--brand-border-subtle)] bg-[var(--brand-surface)] px-2 py-0.5 font-sans text-xs font-medium text-[var(--brand-fg)] hover:border-[var(--brand-accent)] cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Input</span>
            </button>
          )}

          {/* Peel next layer button */}
          {result?.output && onCopyOutputToInput && (
            <button
              onClick={onCopyOutputToInput}
              title="Copy clean output back into input to peel nested obfuscation layers"
              className="flex items-center gap-1 rounded border border-[var(--brand-accent)]/40 bg-[var(--brand-accent-soft)] px-2.5 py-0.5 font-sans text-xs font-semibold text-[var(--brand-accent-ink)] hover:bg-[var(--brand-accent)] hover:text-[var(--brand-accent-fg)] transition-all cursor-pointer shadow-xs"
            >
              <Layers className="h-3 w-3" />
              <span>Peel Next Layer</span>
            </button>
          )}

          {result && (
            <span className="hidden sm:inline">
              <strong className="text-[var(--brand-fg)]">{result.durationMs}ms</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
