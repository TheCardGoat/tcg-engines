import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01GundamFullArmorThunderboltEx009 } from "./009-gundam-full-armor-thunderbolt-ex.ts";

describe("Gundam Full Armor (Thunderbolt) (EX) (EB01-009)", () => {
  /** @behavioral-proof complete: opponent-owned selection and resulting rest state. */
  it("【Deploy】 lets each enemy player choose one of their active Units to rest", () => {
    const first = createMockUnit({ name: "First active Unit" });
    const second = createMockUnit({ name: "Second active Unit" });
    const engine = GundamTestEngine.create(
      { hand: [eb01GundamFullArmorThunderboltEx009], resourceArea: activeResources(5) },
      { play: [first, second] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [fullArmorId] = p1.getHand();
    const [firstId, secondId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(fullArmorId!));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected opponent's public choice");
    expect(choice.legalTargetIds).toEqual([firstId, secondId]);
    expectSuccess(p2.resolveEffect({ targets: [secondId!] }));

    expect(p2.isExhausted(secondId!)).toBe(true);
    expect(p2.isExhausted(firstId!)).toBe(false);
  });
});
