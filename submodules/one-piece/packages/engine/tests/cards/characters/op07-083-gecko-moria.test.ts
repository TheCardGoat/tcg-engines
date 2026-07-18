import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op06Cerberus087,
  op06Kikunojo104,
  op06Kumacy085,
  op06ShadowsAsgard095,
  op06Taralan089,
  op07GeckoMoria083,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-083 Gecko Moria", () => {
  test("orders four included Thriller Bark Pirates cards for power and Banish this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op07GeckoMoria083, playedOnTurn: 0 }],
        trash: [op06Cerberus087, op06Kumacy085, op06Taralan089, op06ShadowsAsgard095, eb01Doma005],
      },
      { life: [op06Kikunojo104, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const moriaId = engine.findCardInZone("south", "character", op07GeckoMoria083);
    const eligibleIds = [
      engine.findCardInZone("south", "trash", op06Cerberus087),
      engine.findCardInZone("south", "trash", op06Kumacy085),
      engine.findCardInZone("south", "trash", op06Taralan089),
      engine.findCardInZone("south", "trash", op06ShadowsAsgard095),
    ];
    const nonmatchingId = engine.findCardInZone("south", "trash", eb01Doma005);
    const triggerLifeId = engine.findCardInZone("north", "life", op06Kikunojo104);

    engine.activateEffect(moriaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 4, max: 4, ordered: true });
    if (cost?.kind !== "payCost") throw new Error("Expected Gecko Moria's ordered trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(eligibleIds);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonmatchingId);
    const submittedOrder = [...eligibleIds].reverse();
    engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds: submittedOrder }, "south");

    expect(engine.getState().players.south.deck.slice(-4)).toEqual(submittedOrder);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === moriaId)
        ?.power,
    ).toBe(6000);

    engine.declareAttack(moriaId, engine.leader("north"), "south");
    let view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerLifeId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(
      triggerLifeId,
    );
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === moriaId)?.power).toBe(
      5000,
    );
  });

  test("cannot activate with only three eligible Thriller Bark Pirates cards in trash", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07GeckoMoria083],
      trash: [op06Cerberus087, op06Kumacy085, op06Taralan089, eb01Doma005],
    });
    const moriaId = engine.findCardInZone("south", "character", op07GeckoMoria083);
    const trashBefore = [...engine.getState().players.south.trash];

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: moriaId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(engine.getState().players.south.trash).toEqual(trashBefore);
  });

  test("may decline without moving trash cards or gaining power and Banish", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op07GeckoMoria083, playedOnTurn: 0 }],
      trash: [op06Cerberus087, op06Kumacy085, op06Taralan089, op06ShadowsAsgard095],
    });
    const moriaId = engine.findCardInZone("south", "character", op07GeckoMoria083);
    const trashBefore = [...engine.getState().players.south.trash];
    const deckBefore = [...engine.getState().players.south.deck];

    engine.activateEffect(moriaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(engine.getState().players.south.trash).toEqual(trashBefore);
    expect(engine.getState().players.south.deck).toEqual(deckBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === moriaId)?.power).toBe(
      op07GeckoMoria083.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
