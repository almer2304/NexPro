import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "NexPro Property";
  const price = searchParams.get("price") ?? "";
  const city = searchParams.get("city") ?? "Indonesia";
  const image = searchParams.get("image") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#000802",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BG image */}
        {image && (
          <img
            src={image}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
            alt=""
          />
        )}
        {/* Gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(0,8,2,0.9) 0%, rgba(0,8,2,0.5) 100%)",
        }} />

        {/* Content */}
        <div style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          height: "100%",
        }}>
          {/* Logo */}
          <div style={{
            position: "absolute",
            top: 48,
            left: 60,
            fontSize: 28,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-1px",
          }}>
            Nex<span style={{ color: "#10b981" }}>Pro</span>
          </div>

          {/* For Sale badge */}
          <div style={{
            display: "flex",
            marginBottom: 16,
          }}>
            <span style={{
              background: "#10b981",
              color: "white",
              fontSize: 14,
              fontWeight: 900,
              padding: "6px 16px",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}>
              {city}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 52,
            fontWeight: 900,
            color: "white",
            margin: "0 0 16px",
            lineHeight: 1.1,
            maxWidth: "800px",
          }}>
            {title}
          </h1>

          {/* Price */}
          {price && (
            <p style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#10b981",
              margin: 0,
            }}>
              {price}
            </p>
          )}

          {/* Footer */}
          <p style={{
            position: "absolute",
            bottom: 48,
            right: 60,
            fontSize: 14,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
          }}>
            nexpro.id
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
