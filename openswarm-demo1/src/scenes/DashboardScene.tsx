import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  Easing,
} from "remotion";

export const DashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screenshot enters with a spring scale
  const enterProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const screenshotScale = interpolate(enterProgress, [0, 1], [0.85, 1]);
  const screenshotOpacity = enterProgress;

  // Slow zoom into the dashboard over time
  const zoomProgress = interpolate(frame, [30, 240], [1, 1.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Pan slightly to show different parts
  const panX = interpolate(frame, [30, 120, 200, 240], [0, -40, -20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const panY = interpolate(frame, [30, 120, 200, 240], [0, -20, -30, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label callouts that appear at different times
  const labels = [
    {
      text: "Spatial Canvas",
      x: 640,
      y: 80,
      delay: 40,
    },
    {
      text: "5 Agents Running",
      x: 350,
      y: 50,
      delay: 80,
    },
    {
      text: "Browser & View Cards",
      x: 900,
      y: 400,
      delay: 130,
    },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Screenshot with zoom/pan */}
      <div
        style={{
          opacity: screenshotOpacity,
          transform: `scale(${screenshotScale * zoomProgress}) translate(${panX}px, ${panY}px)`,
        }}
      >
        <Img
          src={staticFile("screenshot.png")}
          style={{
            width: 1200,
            borderRadius: 16,
            boxShadow: "0 20px 80px rgba(174, 86, 48, 0.3)",
          }}
        />
      </div>

      {/* Animated labels */}
      {labels.map((label, i) => {
        const labelProgress = spring({
          frame: frame - label.delay,
          fps,
          config: { damping: 200 },
        });

        const labelOpacity = Math.max(0, labelProgress);
        const labelY = interpolate(labelProgress, [0, 1], [15, 0]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: label.x,
              top: label.y,
              opacity: labelOpacity,
              transform: `translateY(${labelY}px) scale(${zoomProgress}) translate(${panX}px, ${panY}px)`,
            }}
          >
            <div
              style={{
                background: "rgba(174, 86, 48, 0.95)",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 600,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              {label.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
