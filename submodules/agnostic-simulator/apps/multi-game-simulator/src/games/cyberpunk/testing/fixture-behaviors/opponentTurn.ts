import { CYBERPUNK_P1, CYBERPUNK_P2, type CyberpunkSimulatorPom } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

async function expectOpponentTurnState(pom: CyberpunkSimulatorPom): Promise<void> {
  expectEqual("opponentTurn phase", await pom.getPhase(), "main");
  expectEqual("opponentTurn turn", await pom.getTurnNumber(), 2);
  expectEqual("opponentTurn active player", await pom.getActivePlayerId(), CYBERPUNK_P2);
  expectEqual("opponentTurn game over", await pom.isGameOver(), false);

  await pom.expectBoardMode(CYBERPUNK_P1, "view");
  await pom.expectBoardMode(CYBERPUNK_P2, "select-action");
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
  await pom.expectFixerDiceCount(CYBERPUNK_P2, 5);
  await pom.expectGigCount(CYBERPUNK_P2, 1);
  await pom.expectEddies(CYBERPUNK_P2, 3);
}

export const opponentTurnBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "opponentTurn",
  label: "Observing - opponent's turn",
  references: ["packages/engine/tests/flow/two-turns.test.ts"],
  async run(pom) {
    await expectOpponentTurnState(pom);

    await pom.takeControl(CYBERPUNK_P2);
    await pom.expectBoardMode(CYBERPUNK_P1, "view");
    await pom.expectBoardMode(CYBERPUNK_P2, "select-action");

    await pom.passPhase(CYBERPUNK_P2);

    expectEqual("phase after P2 passes", await pom.getPhase(), "start");
    expectEqual("active player after P2 passes", await pom.getActivePlayerId(), CYBERPUNK_P1);
    expectEqual("turn after P2 passes", await pom.getTurnNumber(), 3);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "gainGig");
    await pom.expectBoardMode(CYBERPUNK_P1, "select-target");
    await pom.expectBoardMode(CYBERPUNK_P2, "view");
  },
};
