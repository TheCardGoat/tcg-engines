import { eb01Doma005, eb01MountainGod018, op09Mr1DazBonez055 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Mr4Babe093 } from "../../../../../cards/src/cards/OP14EB04/characters/093-mr-4-babe.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-093 Mr.4(Babe)", () => {
  test("blocks an attack, then on K.O. may return an included cost-8-or-less Baroque Works Character from trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Mr4Babe093], trash: [op09Mr1DazBonez055, eb01Doma005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sourceId = engine.findCardInZone("south", "character", op14eb04Mr4Babe093);
    const recoverId = engine.findCardInZone("south", "trash", op09Mr1DazBonez055);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [sourceId] }, "south");
    const returnCard = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (returnCard?.kind !== "selectEntity") throw new Error("Expected Mr.4's trash recovery.");
    expect(returnCard).toMatchObject({ min: 0, max: 1 });
    expect(returnCard.candidates.map((candidate) => candidate.ref.id)).toContain(recoverId);
    expect(returnCard.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recoverId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(recoverId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.prompts).toHaveLength(0);
  });
});
