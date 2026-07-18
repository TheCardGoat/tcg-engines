import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op04Pell013 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-013 Pell", () => {
  test("with DON!!, K.O.s a selected opposing Character with 4000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Pell013, attachedDon: 1, playedOnTurn: 0 }],
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pellId = engine.findCardInZone("south", "character", op04Pell013);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(pellId, engine.leader("north"), "south");

    const koChoice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(koChoice?.kind).toBe("selectEntity");
    if (koChoice?.kind !== "selectEntity") throw new Error("Expected Pell's K.O. choice.");
    expect(koChoice.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(koChoice.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may select no Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Pell013, attachedDon: 1, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pellId = engine.findCardInZone("south", "character", op04Pell013);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(pellId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the K.O. without attached DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04Pell013, playedOnTurn: 0 }],
      },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pellId = engine.findCardInZone("south", "character", op04Pell013);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(pellId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
