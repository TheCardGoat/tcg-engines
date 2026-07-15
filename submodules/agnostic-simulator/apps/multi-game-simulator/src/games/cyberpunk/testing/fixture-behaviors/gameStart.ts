import { CYBERPUNK_P1, CYBERPUNK_P2, type CyberpunkSimulatorPom } from "../cyberpunk-simulator-pom";
import {
  expectEqual,
  playerLabel,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

async function expectOpeningSetupState(pom: CyberpunkSimulatorPom): Promise<void> {
  expectEqual("initial phase", await pom.getPhase(), "setup");

  for (const player of [CYBERPUNK_P1, CYBERPUNK_P2]) {
    const label = playerLabel(player);
    await pom.expectHandSize(player, 6);
    await pom.expectFaceDownLegendsCount(player, 3);
    await pom.expectFixerDiceCount(player, 6);
    await pom.expectGigCount(player, 0);
    expectEqual(`${label} eddies`, await pom.getEddies(player), 0);
  }
}

export const gameStartBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gameStart",
  label: "Setup - very beginning",
  references: [
    "packages/engine/tests/setup.test.ts",
    "packages/engine/tests/flow/two-turns.test.ts",
  ],
  async run(pom) {
    await expectOpeningSetupState(pom);

    const first = await pom.getActivePlayerId();
    const second = await pom.getOpponentOf(first);

    await pom.clearDispatchLog();
    await pom.mulligan(first);
    await pom.expectLastDispatch({ type: "mulligan", as: first });
    await pom.expectHandSize(first, 6);
    expectEqual("phase after first mulligan", await pom.getPhase(), "setup");

    await pom.keepHand(second);
    await pom.expectLastDispatch({ type: "keepHand", as: second });
    expectEqual("phase after mulligan and keep", await pom.getPhase(), "start");
    await pom.expectHandSize(first, 7);
    await pom.expectHandSize(second, 6);
    await pom.expectFaceDownLegendsCount(first, 3);
    await pom.expectFaceDownLegendsCount(second, 3);
    await pom.expectFixerDiceCount(first, 6);
    await pom.expectFixerDiceCount(second, 6);
    await pom.expectGigCount(first, 0);
    await pom.expectGigCount(second, 0);
  },
};
