import { CyberpunkTestEngine } from "@tcg/cyberpunk-engine";
import { getScenario, P1, P2, type ScenarioId } from "../engine/fixtures/scenarios";

/** Local clock/presence presentation fixture. Does not submit a hosted claim. */
/** A local UI fixture for the hosted clock/presence boundary, not a hosted match. */
export function buildRivalTimeoutFixture(scenarioId: ScenarioId) {
  const state = structuredClone(getScenario(scenarioId).build().getState());
  state.ctx.clockState = Object.fromEntries(
    [P1, P2].map((id) => [
      id,
      {
        reserveMsRemaining: id === P2 ? -233_000 : 605_000,
        totalConsumedMs: 0,
        movesMade: 0,
        lastUpdatedAtMs: Date.now(),
        isOnClock: false,
      },
    ]),
  );
  return CyberpunkTestEngine.fromState(state);
}

export const timeoutFixtureConnections = {
  player: { status: "connected", connected: true },
  opponent: { status: "connected", connected: true },
} as const;
