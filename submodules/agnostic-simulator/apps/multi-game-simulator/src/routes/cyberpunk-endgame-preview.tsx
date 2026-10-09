import { CyberpunkSimulatorProviders } from "../games/cyberpunk/App";
import { EndGameModalFixture } from "../games/cyberpunk/components/EndGameModal/EndGameModal";

/** Small visual fixture for the cyberpunk post-game modal; all numbers are illustrative. */
export default function CyberpunkEndgamePreview() {
  if (!import.meta.env.DEV) return null;
  return (
    <CyberpunkSimulatorProviders>
      <EndGameModalFixture />
    </CyberpunkSimulatorProviders>
  );
}
