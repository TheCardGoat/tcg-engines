import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005 } from "@tcg/op-cards";
import { op13DouglasBullet068 } from "../../../../../cards/src/cards/OP13/characters/068-douglas-bullet.ts";
import { op13Nekomamushi071 } from "../../../../../cards/src/cards/OP13/characters/071-nekomamushi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-071 Nekomamushi", () => {
  test("at exactly eight field DON!!, K.O.s the selected opposing base-power-3000 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13Nekomamushi071],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: op13Nekomamushi071.cost,
        restedDon: 4,
      },
      { character: [eb01Doma005, op13DouglasBullet068] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooPowerfulId = engine.findCardInZone("north", "character", op13DouglasBullet068);

    engine.playCard(op13Nekomamushi071, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Nekomamushi's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(tooPowerfulId);
    expect(view.prompts).toHaveLength(0);
  });

  test("at eight DON!! may choose no K.O. target", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13Nekomamushi071],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: op13Nekomamushi071.cost,
        restedDon: 4,
      },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13Nekomamushi071, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });

  test("at seven field DON!! does not offer or perform the K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13Nekomamushi071],
        character: [{ card: eb01Doma005, attachedDon: 1 }],
        activeDon: op13Nekomamushi071.cost,
        restedDon: 3,
      },
      { character: [eb01Doma005] },
    );
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13Nekomamushi071, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });
});
