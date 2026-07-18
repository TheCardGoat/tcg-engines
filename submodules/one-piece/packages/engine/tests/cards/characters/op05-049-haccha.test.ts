import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op05Haccha049 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-049 Haccha", () => {
  test("with DON!! x1, may return a current-cost-3 Character from either field to its owner", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Haccha049, attachedDon: 1, playedOnTurn: 0 }, eb01Doma005],
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const hacchaId = engine.findCardInZone("south", "character", op05Haccha049);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(hacchaId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Haccha's Character target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may choose zero, while attacking without attached DON!! offers no effect", () => {
    const optional = OnePieceTestEngine.create(
      { character: [{ card: op05Haccha049, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    optional.declareAttack(
      optional.findCardInZone("south", "character", op05Haccha049),
      optional.leader("north"),
      "south",
    );
    optional.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      optional.getView("south").players.north.characters.filter((card) => card !== null),
    ).toHaveLength(1);

    const gated = OnePieceTestEngine.create(
      { character: [{ card: op05Haccha049, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    gated.declareAttack(
      gated.findCardInZone("south", "character", op05Haccha049),
      gated.leader("north"),
      "south",
    );
    expect(gated.getView("south").prompts).toHaveLength(0);
    expect(op05Haccha049.traits).toEqual(["Giant", "Animal Kingdom Pirates"]);
  });
});
