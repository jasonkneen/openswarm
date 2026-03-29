import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoProgress = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const textProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 200 },
  });

  const urlProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 200 },
  });

  const subtextProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 200 },
  });

  const textY = interpolate(textProgress, [0, 1], [20, 0]);
  const urlY = interpolate(urlProgress, [0, 1], [20, 0]);

  // Subtle pulsing glow on CTA
  const pulse = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.4, 0.7, 0.4],
    { extrapolateRight: "clamp" }
  );

  // Fade out at the very end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #ae5630 0%, transparent 60%)",
          opacity: pulse * 0.15,
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoProgress})`,
          marginBottom: 24,
        }}
      >
        <Img
          src={staticFile("icon.png")}
          style={{
            width: 100,
            height: 100,
            borderRadius: 16,
          }}
        />
      </div>

      {/* Get Started text */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: "#ffffff",
          opacity: textProgress,
          transform: `translateY(${textY}px)`,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          letterSpacing: -1,
        }}
      >
        Get Started
      </div>

      {/* URL */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: "#ae5630",
          opacity: Math.max(0, urlProgress),
          transform: `translateY(${urlY}px)`,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          marginTop: 16,
          padding: "12px 32px",
          border: "2px solid #ae5630",
          borderRadius: 12,
        }}
      >
        openswarm.info
      </div>

      {/* Open source badge */}
      <div
        style={{
          fontSize: 18,
          color: "#666",
          opacity: Math.max(0, subtextProgress),
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          marginTop: 24,
          fontWeight: 500,
        }}
      >
        Free & Open Source
      </div>
    </AbsoluteFill>
  );
};
