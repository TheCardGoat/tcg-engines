import { eb01Doma005, op02Sakazuki099, op02Vista011 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04CaponeGangBege003 } from "../../../../../cards/src/cards/OP14EB04/characters/003-capone-gang-bege.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe('OP14-003 Capone"Gang"Bege', () => {
  test("is excluded from a 5000-or-less opponent Character effect but remains a legal battle target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04CaponeGangBege003, eb01Doma005],
      },
      {
        hand: [op02Vista011],
        activeDon: op02Vista011.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const begeId = engine.findCardInZone("south", "character", op14eb04CaponeGangBege003);
    const vulnerableId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.playCard(op02Vista011, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Vista's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(begeId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(vulnerableId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [vulnerableId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(begeId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(vulnerableId);
    expect(view.prompts).toHaveLength(0);
  });

  test("can be K.O.'d by an opponent Character effect above the 5000 base-power boundary", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04CaponeGangBege003] },
      {
        hand: [op02Sakazuki099, eb01Doma005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const begeId = engine.findCardInZone("south", "character", op14eb04CaponeGangBege003);
    const paymentId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(op02Sakazuki099, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sakazuki's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(begeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [begeId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(begeId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.prompts).toHaveLength(0);
  });
});
