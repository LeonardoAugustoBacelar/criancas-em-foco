import { ImageResponse } from "next/og";

export const alt = "Crianças em Foco";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 16,
              background: "#18181b",
              color: "#ffffff",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            CF
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              color: "#18181b",
              letterSpacing: -1,
            }}
          >
            Crianças em Foco
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            color: "#2f6f6b",
            fontWeight: 600,
          }}
        >
          Apoio especializado para mães e professoras
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            width: 160,
            height: 6,
            borderRadius: 3,
            background: "#2f6f6b",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
