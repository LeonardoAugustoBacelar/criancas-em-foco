"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "420px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
            Algo deu errado
          </h1>
          <p style={{ color: "#52525b", marginBottom: "20px" }}>
            Pedimos desculpa pelo transtorno. Já fomos avisados do problema.
            Tente novamente em instantes.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#18181b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
