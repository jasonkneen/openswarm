import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

const features = [
  {
    icon: "parallel",
    title: "Parallel Agents",
    description: "Run unlimited agents side by side",
    color: "#818cf8",
  },
  {
    icon: "approval",
    title: "Human-in-the-Loop",
    description: "Approve every action before it runs",
    color: "#4ade80",
  },
  {
    icon: "local",
    title: "100% Local",
    description: "No cloud. No telemetry. Your machine.",
    color: "#fbbf24",
  },
];

const FeatureIcon: React.FC<{ type: string; color: string }> = ({
  type,
  color,
}) => {
  if (type === "parallel") {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="4" y="8" width="14" height="28" rx="3" fill={color} opacity={0.7} />
        <rect x="22" y="4" width="14" height="36" rx="3" fill={color} />
        <rect x="13" y="12" width="14" height="20" rx="3" fill={color} opacity={0.5} />
      </svg>
    );
  }
  if (type === "approval") {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="18" stroke={color} strokeWidth="3" fill="none" />
        <path d="M14 22l6 6 10-12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="6" y="6" width="32" height="32" rx="6" stroke={color} strokeWidth="3" fill="none" />
      <circle cx="22" cy="22" r="6" fill={color} />
      <path d="M22 12v-4M22 36v-4M12 22H8M36 22h-4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const FeaturesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      {/* Section title */}
      <div
        style={{
          position: "absolute",
          top: 100,
          fontSize: 22,
          fontWeight: 600,
          color: "#ae5630",
          opacity: titleProgress,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        Why Open Swarm
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: "flex",
          gap: 48,
          marginTop: 40,
        }}
      >
        {features.map((feature, i) => {
          const cardProgress = spring({
            frame: frame - 8 - i * 10,
            fps,
            config: { damping: 15, stiffness: 120 },
          });

          const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
          const cardY = interpolate(cardProgress, [0, 1], [40, 0]);

          return (
            <div
              key={i}
              style={{
                opacity: Math.max(0, cardProgress),
                transform: `scale(${cardScale}) translateY(${cardY}px)`,
                background: "#141414",
                border: `1px solid ${feature.color}22`,
                borderRadius: 16,
                padding: "40px 36px",
                width: 320,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  marginBottom: 20,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FeatureIcon type={feature.icon} color={feature.color} />
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: 12,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                }}
              >
                {feature.title}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "#888",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
