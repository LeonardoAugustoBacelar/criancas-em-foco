"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function PixKeyCopy({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponível (ex: contexto não seguro) — o valor
      // já está visível para cópia manual.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-primary-100 bg-primary-50 px-4 py-2.5">
      <code className="flex-1 truncate text-sm font-semibold text-primary-700">
        {value}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="btn-press flex shrink-0 items-center gap-1.5 rounded-md bg-primary-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copiado
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copiar
          </>
        )}
      </button>
    </div>
  );
}
