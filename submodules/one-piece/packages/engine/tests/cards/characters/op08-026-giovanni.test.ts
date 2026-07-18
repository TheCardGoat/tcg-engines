import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op08Giovanni026 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-026 Giovanni", () => {
  test("with DON!! x1, when attacking freezes an opposing rested cost-1-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op08Giovanni026, playedOnTurn: 0 }], activeDon: 1 },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01MountainGod018, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const giovanniId = engine.findCardInZone("south", "character", op08Giovanni026);
    engine.attachDon(giovanniId, 1, "south");

    engine.declareAttack(giovanniId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Giovanni's freeze choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    engine.endTurn("north");
    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
  });

  test("does not trigger when attacking without an attached DON!! card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op08Giovanni026, playedOnTurn: 0 }] },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const giovanniId = engine.findCardInZone("south", "character", op08Giovanni026);

    engine.declareAttack(giovanniId, engine.leader("north"), "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
