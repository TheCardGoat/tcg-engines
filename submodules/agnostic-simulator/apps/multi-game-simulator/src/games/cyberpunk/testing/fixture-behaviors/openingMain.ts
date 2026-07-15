import { CYBERPUNK_P1, CYBERPUNK_P2, type CyberpunkSimulatorPom } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

async function expectOpeningMainState(pom: CyberpunkSimulatorPom): Promise<void> {
  expectEqual("openingMain phase", await pom.getPhase(), "main");
  expectEqual("openingMain turn", await pom.getTurnNumber(), 1);
  expectEqual("openingMain active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
  expectEqual("openingMain game over", await pom.isGameOver(), false);

  await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
  await pom.expectBoardMode(CYBERPUNK_P2, "view");
  await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
  await pom.expectPendingChoiceType(CYBERPUNK_P2, null);

  await pom.expectHandSize(CYBERPUNK_P1, 3);
  await pom.expectFieldSize(CYBERPUNK_P1, 2);
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P1, 2);
  await pom.expectFixerDiceCount(CYBERPUNK_P1, 6);
  await pom.expectGigCount(CYBERPUNK_P1, 0);
  await pom.expectEddies(CYBERPUNK_P1, 5);

  await pom.expectFieldSize(CYBERPUNK_P2, 2);
  await pom.expectFaceDownLegendsCount(CYBERPUNK_P2, 0);
  await pom.expectFixerDiceCount(CYBERPUNK_P2, 6);
  await pom.expectGigCount(CYBERPUNK_P2, 0);
  await pom.expectEddies(CYBERPUNK_P2, 3);
}

export const openingMainBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "openingMain",
  label: "Opening - your turn",
  references: ["packages/engine/tests/flow/two-turns.test.ts"],
  async run(pom) {
    await expectOpeningMainState(pom);

    await pom.passPhase(CYBERPUNK_P1);

    expectEqual("phase after P1 passes", await pom.getPhase(), "start");
    expectEqual("active player after P1 passes", await pom.getActivePlayerId(), CYBERPUNK_P2);
    expectEqual("turn after P1 passes", await pom.getTurnNumber(), 2);
    await pom.expectPendingChoiceType(CYBERPUNK_P2, "gainGig");
    await pom.expectBoardMode(CYBERPUNK_P1, "view");
    await pom.expectBoardMode(CYBERPUNK_P2, "select-target");
  },
};
