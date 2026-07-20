import { eb01Doma005, eb01Fourtricks025, op13Curiel044, op13EdwardNewgate042 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13MarshallDTeach053 } from "../../../../../cards/src/cards/OP13/characters/053-marshall-d-teach.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-053 Marshall.D.Teach", () => {
  test("pays an included Whitebeard Pirates Character, draws, and gains Banish for this turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op13MarshallDTeach053, playedOnTurn: 0 },
          op13Curiel044,
          op13EdwardNewgate042,
          eb01Fourtricks025,
        ],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      {
        life: [eb01Fourtricks025, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teachId = engine.findCardInZone("south", "character", op13MarshallDTeach053);
    const paidId = engine.findCardInZone("south", "character", op13Curiel044);
    const compositeId = engine.findCardInZone("south", "character", op13EdwardNewgate042);
    const excludedId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const firstLifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);
    const secondLifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashCharacter", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Teach's Character-trash cost.");
    const candidates = cost.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual(expect.arrayContaining([teachId, paidId, compositeId]));
    expect(candidates).not.toContain(excludedId);
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [paidId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(firstLifeId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(firstLifeId);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    view = engine.getView("south");
    const opponentView = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(0);
    expect(opponentView.players.north.hand.map((card) => card.instanceId)).toContain(secondLifeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing a Character, drawing, or gaining Banish", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13MarshallDTeach053, playedOnTurn: 0 }, op13Curiel044],
        deck: [eb01Doma005],
      },
      { life: [eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const teachId = engine.findCardInZone("south", "character", op13MarshallDTeach053);
    const allyId = engine.findCardInZone("south", "character", op13Curiel044);
    const lifeId = engine.findCardInZone("north", "life", eb01Fourtricks025);

    engine.declareAttack(teachId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    const opponentView = engine.getView("north");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(allyId);
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.deckCount).toBe(1);
    expect(opponentView.players.north.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(lifeId);
    expect(view.prompts).toHaveLength(0);
  });
});
