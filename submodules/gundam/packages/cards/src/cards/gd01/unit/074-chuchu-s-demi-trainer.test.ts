import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ChuchuSDemiTrainer074 } from "./074-chuchu-s-demi-trainer.ts";

describe("Chuchu's Demi Trainer (GD01-074)", () => {
  it("links with Chuatury, draws on attack, and asks the player which visible hand card to discard", () => {
    const chuatury = createMockPilot({ name: "Chuatury Panlunch", level: 1, cost: 1 });
    const firstDiscardOption = createMockUnit({ name: "First Option" });
    const secondDiscardOption = createMockUnit({ name: "Second Option" });
    const drawnCard = createMockUnit({ name: "Drawn Card" });
    const remainingDeckCard = createMockUnit({ name: "Remaining Deck Card" });
    const setupAttacker = createMockUnit({ ap: 0, hp: 6 });
    const defender = createMockUnit({
      hp: 6,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ChuchuSDemiTrainer074, chuatury, firstDiscardOption, secondDiscardOption],
        play: [setupAttacker],
        deck: [remainingDeckCard, drawnCard],
        resourceArea: activeResources(3),
      },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const setupAttackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(setupAttackerId, "direct"));
    expectSuccess(p2.declareBlock(defenderId));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expectSuccess(p1.deployUnit(gd01ChuchuSDemiTrainer074));
    const chuchuId = p1.getCardsInZone("battleArea").at(-1)!;
    expectSuccess(p1.assignPilot(chuatury, chuchuId));
    const [firstOptionId, secondOptionId] = p1.getHand();
    expectSuccess(p1.enterBattle(chuchuId, defenderId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstOptionId, secondOptionId]),
      minTargets: 1,
      maxTargets: 1,
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a visible discard choice");
    expect(choice.legalTargetIds).toHaveLength(3);
    expectSuccess(p1.resolveEffect({ targets: [secondOptionId!] }));

    expect(p1.getCardZone(secondOptionId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(firstOptionId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(2);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
  });
});
