import React, { useState, useRef } from 'react';
import { FileCode, Upload, Globe, Trash2, ClipboardPaste, ArrowRight } from 'lucide-react';

interface EditorPaneProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  onSwitchToOutput?: () => void;
  hasOutput?: boolean;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  value,
  onChange,
  onClear,
  onSwitchToOutput,
  hasOutput,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lines = value ? value.split('\n').length : 1;
  const chars = value.length;
  const sizeKb = (new Blob([value]).size / 1024).toFixed(1);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) onChange(text);
    } catch {
      // Clipboard access not granted
    }
  };

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        onChange(content);
        setActiveTab('text');
      }
    };
    reader.readAsText(file);
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    setUrlError(null);
    try {
      const res = await fetch(urlInput.trim());
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const text = await res.text();
      onChange(text);
      setActiveTab('text');
    } catch (err: any) {
      setUrlError(
        'Fetch failed (Cross-Origin CORS restrictions may block external scripts). Error: ' +
          (err?.message || err)
      );
    } finally {
      setIsFetchingUrl(false);
    }
  };

  return (
    <div className="flex flex-col h-full border border-[var(--brand-border)] bg-[var(--brand-surface)] rounded-xl overflow-hidden shadow-xs">
      {/* Pane Tab Header */}
      <div className="flex items-center justify-between border-b border-[var(--brand-border)] bg-[var(--brand-bg)]/80 px-2.5 sm:px-3 py-2 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-[var(--brand-surface)] text-[var(--brand-fg)] shadow-xs'
                : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Code Input</span>
          </button>

          <button
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'bg-[var(--brand-surface)] text-[var(--brand-fg)] shadow-xs'
                : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>File</span>
            {fileName && (
              <span className="font-mono text-[10px] text-[var(--brand-accent)] truncate max-w-[70px]">
                ({fileName})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-[var(--brand-surface)] text-[var(--brand-fg)] shadow-xs'
                : 'text-[var(--brand-muted)] hover:text-[var(--brand-fg)]'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>URL</span>
          </button>
        </div>

        {/* Quick actions & stats */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] text-[var(--brand-muted)] shrink-0">
          <span className="hidden sm:inline-block">
            {lines.toLocaleString()}L · {chars.toLocaleString()}C ({sizeKb} KB)
          </span>

          <button
            onClick={handlePaste}
            title="Paste from clipboard"
            className="flex items-center gap-1 p-1.5 sm:px-1.5 sm:py-0.5 rounded text-[var(--brand-muted)] hover:text-[var(--brand-fg)] hover:bg-[var(--brand-border-subtle)] cursor-pointer"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[10px] font-sans">Paste</span>
          </button>

          <button
            onClick={onClear}
            title="Clear code"
            className="flex items-center gap-1 p-1.5 sm:px-1.5 sm:py-0.5 rounded text-[var(--brand-muted)] hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[10px] font-sans">Clear</span>
          </button>

          {/* Quick jump to output on mobile */}
          {hasOutput && onSwitchToOutput && (
            <button
              onClick={onSwitchToOutput}
              className="lg:hidden flex items-center gap-1 rounded bg-[var(--brand-accent-soft)] px-2 py-0.5 font-sans text-xs font-semibold text-[var(--brand-accent-ink)] cursor-pointer"
            >
              <span>Output</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Pane Content */}
      <div className="relative flex-1 min-h-[360px] lg:min-h-[500px]">
        {activeTab === 'text' && (
          <div className="flex h-full w-full">
            {/* Line Numbers column */}
            <div className="select-none bg-[var(--brand-bg)]/40 border-r border-[var(--brand-border-subtle)] py-3 px-2 font-mono text-xs text-[var(--brand-muted)]/50 text-right min-w-[36px] sm:min-w-[42px] overflow-hidden">
              {Array.from({ length: Math.min(lines, 500) }).map((_, i) => (
                <div key={i} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Input Area */}
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="// Paste obfuscated, packed, or encoded JavaScript here..."
              spellCheck={false}
              className="flex-1 w-full h-full resize-none p-3 font-mono text-xs leading-6 bg-transparent text-[var(--brand-fg)] focus:outline-none focus:ring-0 placeholder-[var(--brand-muted)]/50"
            />
          </div>
        )}

        {activeTab === 'file' && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
            className={`flex flex-col items-center justify-center h-full p-6 sm:p-8 border-2 border-dashed m-3 sm:m-4 rounded-xl transition-all ${
              isDragging
                ? 'border-[var(--brand-accent)] bg-[var(--brand-accent-soft)]/20'
                : 'border-[var(--brand-border)] bg-[var(--brand-bg)]/30'
            }`}
          >
            <Upload className="h-10 w-10 text-[var(--brand-muted)] mb-3" />
            <h4 className="font-display text-sm font-bold text-[var(--brand-fg)] text-center">
              Drag & Drop JavaScript File
            </h4>
            <p className="text-xs text-[var(--brand-muted)] mt-1 mb-4 text-center max-w-xs">
              Supports .js, .mjs, .cjs, or raw text files. Max 10MB processed client-side.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".js,.mjs,.cjs,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] hover:bg-[var(--brand-accent-hover)] transition-all shadow-xs cursor-pointer"
            >
              Browse Files
            </button>
          </div>
        )}

        {activeTab === 'url' && (
          <div className="flex flex-col justify-center items-center h-full p-4 sm:p-6 max-w-lg mx-auto text-center">
            <Globe className="h-10 w-10 text-[var(--brand-muted)] mb-3" />
            <h4 className="font-display text-sm font-bold text-[var(--brand-fg)]">
              Fetch Remote JavaScript
            </h4>
            <p className="text-xs text-[var(--brand-muted)] mt-1 mb-4">
              Enter the direct public URL of a script or bookmarklet to load and unpack it.
            </p>

            <div className="w-full flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/bundle.min.js"
                className="flex-1 px-3 py-2 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-bg)] font-mono text-xs text-[var(--brand-fg)] focus:outline-none focus:border-[var(--brand-accent)]"
              />
              <button
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !urlInput.trim()}
                className="px-4 py-2 rounded-lg bg-[var(--brand-accent)] text-[var(--brand-accent-fg)] font-semibold text-xs hover:bg-[var(--brand-accent-hover)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isFetchingUrl ? 'Fetching...' : 'Load'}
              </button>
            </div>

            {urlError && (
              <p className="text-xs text-red-500 mt-3 text-left bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                {urlError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
