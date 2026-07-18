import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Carmel101 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-101 Carmel", () => {
  test("draws one when played during its controller's turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op04Carmel101],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: op04Carmel101.cost,
    });
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op04Carmel101, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger plays the physical card, skips the opponent-turn draw, and K.O.s cost 2 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { life: [op04Carmel101] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const carmelId = engine.findCardInZone("north", "life", op04Carmel101);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Carmel's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === carmelId)).toBe(true);
    expect(view.players.north.hand).toHaveLength(0);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
