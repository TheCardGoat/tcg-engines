import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op04Usopp003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-003 Usopp", () => {
  test("after battle K.O., K.O.s only an opposing Character with 5000 base power or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Usopp003, rested: true, playedOnTurn: 0 }] },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const usoppId = engine.findCardInZone("south", "character", op04Usopp003);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, usoppId, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Usopp's On K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(usoppId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no K.O. target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04Usopp003, rested: true, playedOnTurn: 0 }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const usoppId = engine.findCardInZone("south", "character", op04Usopp003);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, usoppId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(usoppId);
    expect(view.players.north.characters.some((card) => card?.instanceId === attackerId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
