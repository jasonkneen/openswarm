import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

// Total scene durations: 120 + 150 + 300 + 180 + 150 = 900
// Minus transitions: 4 * 15 = 60
// Effective duration: 840 frames = 28 seconds at 30fps

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OpenSwarmDemo"
        component={MyComposition}
        durationInFrames={840}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
