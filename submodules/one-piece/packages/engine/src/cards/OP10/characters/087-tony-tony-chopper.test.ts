import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op04CorridaColiseum096,
  op10TonyTonyChopper087,
  op10Usopp042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-087 Tony Tony.Chopper", () => {
  test("cannot activate without resting a Dressrosa Leader or Stage alongside itself", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10TonyTonyChopper087],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const chopperId = engine.findCardInZone("south", "character", op10TonyTonyChopper087);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: chopperId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("pays both rest costs, makes the five-card opponent discard, then trashes the top 2 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [op10TonyTonyChopper087],
        stage: op04CorridaColiseum096,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const chopperId = engine.findCardInZone("south", "character", op10TonyTonyChopper087);
    const stageId = engine.findCardInZone("south", "stage", op04CorridaColiseum096);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.activateEffect(chopperId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Chopper's Dressrosa payment.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), stageId]),
    );
    engine.resolveDecision("effectCostRestCards", { selectedIds: [stageId] }, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardId] }, "north");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.rested,
    ).toBe(true);
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.north.handCount).toBe(4);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10Usopp042,
        character: [op10TonyTonyChopper087],
        stage: op04CorridaColiseum096,
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005] },
    );
    const chopperId = engine.findCardInZone("south", "character", op10TonyTonyChopper087);
    engine.activateEffect(chopperId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
