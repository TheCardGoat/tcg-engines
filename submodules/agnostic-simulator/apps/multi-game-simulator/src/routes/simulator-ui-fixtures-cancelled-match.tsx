import { SimulatorCancelledMatch } from "@tcg/simulator-ui";

export default function SimulatorCancelledMatchFixture() {
  return (
    <SimulatorCancelledMatch
      reason="The match was cancelled."
      matchmakingHref="/cyberpunk/simulator/matchmaking"
    />
  );
}
