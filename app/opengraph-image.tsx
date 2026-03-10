import { ImageResponse } from "next/og";

// This auto-generates the /og-image.png used in social previews.
// When shared on Twitter, LinkedIn, Slack, Discord — this image shows.
// Rendered server-side by Vercel's Edge Runtime — no external tools needed.

export const runtime = "edge";

export const alt = "PDF Studio — Free PDF Tools That Never Leave Your Browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          background: "linear-gradient(135deg, #09090f 0%, #12121f 50%, #0d0d1a 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 500,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Grid dots pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Privacy badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 99,
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
            color: "#6ee7b7",
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 32,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          100% Local Processing
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 20,
            maxWidth: 900,
          }}
        >
          Powerful PDF Tools.{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            100% Private.
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(238,238,248,0.55)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
            marginBottom: 48,
          }}
        >
          Files never leave your device. No uploads, no accounts, no limits.
        </div>

        {/* Tool pills */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 900,
          }}
        >
          {[
            "Merge PDF",
            "Split PDF",
            "Compress",
            "Rotate",
            "Watermark",
            "JPG → PDF",
            "Organize Pages",
            "Page Numbers",
          ].map((tool) => (
            <div
              key={tool}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(238,238,248,0.7)",
                fontSize: 17,
                fontWeight: 500,
              }}
            >
              {tool}
            </div>
          ))}
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(238,238,248,0.3)",
            fontSize: 18,
          }}
        >
          pdf-studio-nu.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
