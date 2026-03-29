import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = "Managing AI agents";
  const line2 = "shouldn't feel like this.";

  const line1Progress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const line2Progress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 200 },
  });

  const line1Y = interpolate(line1Progress, [0, 1], [40, 0]);
  const line2Y = interpolate(line2Progress, [0, 1], [40, 0]);

  // Terminal chaos icons that fade in scattered
  const chaosOpacity = interpolate(frame, [20, 35], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const terminalLines = [
    "$ claude --chat agent-1 &",
    "$ claude --chat agent-2 &",
    "$ claude --chat agent-3 &",
    "[agent-1] Error: context overflow",
    "[agent-2] Waiting for approval...",
    "[agent-3] ████████ 43% complete",
    "$ fg 1",
    "[agent-1] Permission denied: write",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Scattered terminal text in background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: chaosOpacity,
          fontFamily: "monospace",
          fontSize: 14,
          color: "#ff6b5b",
          padding: 60,
          lineHeight: 2.2,
          whiteSpace: "pre-wrap",
        }}
      >
        {terminalLines.map((line, i) => {
          const charCount = interpolate(
            frame,
            [20 + i * 3, 35 + i * 3],
            [0, line.length],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <div key={i} style={{ opacity: 0.6 + (i % 3) * 0.15 }}>
              {line.slice(0, Math.floor(charCount))}
            </div>
          );
        })}
      </div>

      {/* Main text */}
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            opacity: line1Progress,
            transform: `translateY(${line1Y}px)`,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ff6b5b",
            opacity: Math.max(0, line2Progress),
            transform: `translateY(${line2Y}px)`,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            marginTop: 8,
          }}
        >
          {line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};
