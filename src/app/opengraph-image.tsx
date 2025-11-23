import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Block A Race Estimator";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#DC2626",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              margin: 0,
              padding: 0,
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            Block A Race Estimator
          </h1>
          <p
            style={{
              fontSize: "40px",
              fontStyle: "italic",
              opacity: 0.9,
              margin: 0,
              padding: 0,
            }}
          >
            "There are no finish line"
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
