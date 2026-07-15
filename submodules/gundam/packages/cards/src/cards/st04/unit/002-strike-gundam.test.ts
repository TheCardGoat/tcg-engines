import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st04StrikeGundam002 } from "./002-strike-gundam.ts";

describe("Strike Gundam (ST04-002)", () => {
  it("【Deploy】 draws 1, then asks which card from the updated hand to discard", () => {
    const discardOption = createMockUnit({ name: "Discard Option" });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
    const engine = GundamTestEngine.create({
      hand: [st04StrikeGundam002, discardOption],
      resourceArea: activeResources(4),
      deck: [remainingDeckCard, drawnCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const discardOptionId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(st04StrikeGundam002));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([discardOptionId]),
      minTargets: 1,
      maxTargets: 1,
    });
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Strike Gundam to ask which card to discard after drawing");
    }
    expect(choice.legalTargetIds).toHaveLength(2);
    expectSuccess(p1.resolveEffect({ targets: [discardOptionId] }));

    expect(p1.getCardZone(st04StrikeGundam002)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(discardOptionId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });
});
