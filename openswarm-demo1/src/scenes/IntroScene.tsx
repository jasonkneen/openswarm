import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const logoRotation = interpolate(logoScale, [0, 1], [-15, 0]);

  const titleProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
  });

  const taglineProgress = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
  });

  const titleY = interpolate(titleProgress, [0, 1], [30, 0]);
  const taglineY = interpolate(taglineProgress, [0, 1], [20, 0]);

  // Subtle glow pulse behind logo
  const glowScale = interpolate(frame, [0, 60], [0.8, 1.2], {
    extrapolateRight: "clamp",
  });
  const glowOpacity = interpolate(frame, [0, 30, 60], [0, 0.3, 0.15], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Glow effect */}
      <div
        style={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #ae5630 0%, transparent 70%)",
          opacity: glowOpacity,
          transform: `scale(${glowScale})`,
        }}
      />

      {/* Logo */}
      <div
        style={{
          transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
          marginBottom: 24,
        }}
      >
        <Img
          src={staticFile("icon.png")}
          style={{
            width: 140,
            height: 140,
            borderRadius: 20,
          }}
        />
      </div>

      {/* Product name */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: "#ffffff",
          opacity: titleProgress,
          transform: `translateY(${titleY}px)`,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          letterSpacing: -2,
        }}
      >
        Open Swarm
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 28,
          color: "#ae5630",
          opacity: Math.max(0, taglineProgress),
          transform: `translateY(${taglineY}px)`,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          fontWeight: 500,
          marginTop: 12,
        }}
      >
        Your agents, orchestrated.
      </div>
    </AbsoluteFill>
  );
};
