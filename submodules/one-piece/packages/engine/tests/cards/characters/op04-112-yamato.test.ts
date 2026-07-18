import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op04Sanji104, op04Yamato112 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-112 Yamato", () => {
  test("uses both players' Life total for K.O. and adds the exact deck top at one Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Yamato112],
        life: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005, eb01Doma005],
        activeDon: op04Yamato112.cost,
      },
      { character: [eb01Fourtricks025, op04Sanji104], life: [eb01Doma005, eb01Doma005] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const tooExpensiveId = engine.findCardInZone("north", "character", op04Sanji104);
    const deckTopId = engine.getState().players.south.deck[0]!;
    engine.playCard(op04Yamato112, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Yamato's target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(engine.getState().players.south.life[0]).toBe(deckTopId);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(tooExpensiveId);
  });

  test("does not add deck to Life when its controller has two Life", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Yamato112],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op04Yamato112.cost,
    });
    const before = engine.getView("south").players.south;
    const topId = engine.getState().players.south.deck[0];
    engine.playCard(op04Yamato112, "south");
    const after = engine.getView("south").players.south;
    expect(after).toMatchObject({ lifeCount: before.lifeCount, deckCount: before.deckCount });
    expect(engine.getState().players.south.deck[0]).toBe(topId);
  });
});
