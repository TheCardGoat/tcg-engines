import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GundamKimaris070 } from "./070-gundam-kimaris.ts";

describe("Gundam Kimaris (GD02-070)", () => {
  it("draws 2 with 4 Gjallarhorn cards in trash, then asks which 2 cards to discard", () => {
    const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const firstDiscard = createMockUnit({ name: "First Discard" });
    const secondDiscard = createMockUnit({ name: "Second Discard" });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamKimaris070, firstDiscard, secondDiscard],
      trash,
      resourceArea: activeResources(5),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, firstDiscardId, secondDiscardId] = p1.getHand();

    expectSuccess(p1.deployUnit(gd02GundamKimaris070));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstDiscardId, secondDiscardId]),
      minTargets: 2,
      maxTargets: 2,
    });
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Gundam Kimaris to ask which 2 cards to discard after drawing");
    }
    expect(choice.legalTargetIds).toHaveLength(4);
    expectSuccess(p1.resolveEffect({ targets: [firstDiscardId!, secondDiscardId!] }));

    expect(p1.getCardZone(firstDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(secondDiscardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });

  it("does not draw or ask for a discard with only 3 Gjallarhorn cards in trash", () => {
    const trash = Array.from({ length: 3 }, () => createMockUnit({ traits: ["gjallarhorn"] }));
    const keptCard = createMockUnit({ name: "Kept Card" });
    const engine = GundamTestEngine.create({
      hand: [gd02GundamKimaris070, keptCard],
      trash,
      resourceArea: activeResources(5),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const keptCardId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd02GundamKimaris070));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getCardZone(keptCardId)).toBe(`hand:${PLAYER_ONE}`);
  });
});
