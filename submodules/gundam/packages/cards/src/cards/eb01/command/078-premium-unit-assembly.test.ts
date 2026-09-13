import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01PremiumUnitAssembly078 } from "./078-premium-unit-assembly.ts";

describe("Premium Unit Assembly (EB01-078)", () => {
  /** @behavioral-proof complete: each player independently receives and resolves the Unit-only deck look. */
  it("【Main】 lets every player add their own top Unit card", () => {
    const p1Unit = createMockUnit({ name: "P1 Unit" });
    const p2Unit = createMockUnit({ name: "P2 Unit" });
    const engine = GundamTestEngine.create(
      { hand: [eb01PremiumUnitAssembly078], deck: [p1Unit], resourceArea: activeResources(1) },
      { deck: [p2Unit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));
    const p1Choice = p1.getBoardView().pendingChoice;
    if (p1Choice?.kind !== "deckLook") throw new Error("Expected player one's deck look");
    const p1UnitId = p1Choice.legalTutorCardIds[0]!;
    expectSuccess(
      p1.resolveEffect({
        deckLookAnswers: { [p1Choice.directiveIndex]: { tutorCardId: p1UnitId } },
      }),
    );
    expect(p1.getCardZone(p1UnitId)).toBe(`hand:${PLAYER_ONE}`);

    const p2Choice = p2.getBoardView().pendingChoice;
    if (p2Choice?.kind !== "deckLook") throw new Error("Expected player two's deck look");
    const p2UnitId = p2Choice.legalTutorCardIds[0]!;
    expectSuccess(
      p2.resolveEffect({
        deckLookAnswers: { [p2Choice.directiveIndex]: { tutorCardId: p2UnitId } },
      }),
    );
    expect(p2.getCardZone(p2UnitId)).toBe(`hand:${PLAYER_TWO}`);
  });
});
