import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08EdwardWeevil042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-042 Edward Weevil", () => {
  test("with DON!! x1, may return either player's cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op08EdwardWeevil042, attachedDon: 1, playedOnTurn: 0 }, eb01Doma005],
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const weevilId = engine.findCardInZone("south", "character", op08EdwardWeevil042);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(weevilId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Weevil's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownId);
    expect(view.players.north.characters.some((card) => card?.instanceId === opposingId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without attached DON!!, attacking offers no return", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op08EdwardWeevil042, playedOnTurn: 0 }] },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const weevilId = engine.findCardInZone("south", "character", op08EdwardWeevil042);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(weevilId, engine.leader("north"), "south");
    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
