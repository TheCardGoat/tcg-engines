import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op11MonkeyDLuffy058 } from "../../../../../cards/src/cards/OP11/characters/058-monkey-d-luffy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-058 Monkey.D.Luffy", () => {
  test("cannot attack with five hand cards but can attack with four", () => {
    const restricted = OnePieceTestEngine.create(
      {
        character: [{ card: op11MonkeyDLuffy058, playedOnTurn: 0 }],
        hand: Array.from({ length: 5 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const restrictedId = restricted.findCardInZone("south", "character", op11MonkeyDLuffy058);
    expect(
      restricted.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: restrictedId,
        targetId: restricted.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");

    const allowed = OnePieceTestEngine.create(
      {
        character: [{ card: op11MonkeyDLuffy058, playedOnTurn: 0 }],
        hand: Array.from({ length: 4 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const allowedId = allowed.findCardInZone("south", "character", op11MonkeyDLuffy058);
    allowed.declareAttack(allowedId, allowed.leader("north"), "south");
    expect(
      allowed
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === allowedId)?.rested,
    ).toBe(true);
  });

  test("uses its unconditional Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11MonkeyDLuffy058] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const luffyId = engine.findCardInZone("south", "character", op11MonkeyDLuffy058);
    engine.declareAttack(
      engine.findCardInZone("north", "character", eb01MountainGod018),
      engine.leader("south"),
      "north",
    );
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Luffy's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(luffyId);
  });
});
