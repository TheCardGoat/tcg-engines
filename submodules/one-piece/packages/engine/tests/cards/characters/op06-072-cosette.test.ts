import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06Cosette072, op06VinsmokeReiju042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-072 Cosette", () => {
  test("is a Blocker only with a GERMA 66 Leader and a two-DON!! field deficit", () => {
    const eligible = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 2 },
      {
        leaderCardId: op06VinsmokeReiju042,
        character: [op06Cosette072],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = eligible.findCardInZone("south", "character", eb01MountainGod018);
    const cosetteId = eligible.findCardInZone("north", "character", op06Cosette072);

    eligible.declareAttack(attackerId, eligible.leader("north"), "south");
    const blocker = eligible.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Cosette's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(cosetteId);

    const shortByOne = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }], activeDon: 1 },
      {
        leaderCardId: op06VinsmokeReiju042,
        character: [op06Cosette072],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    shortByOne.declareAttack(
      shortByOne.findCardInZone("south", "character", eb01MountainGod018),
      shortByOne.leader("north"),
      "south",
    );
    expect(shortByOne.getView("north").decisions).toHaveLength(0);
  });
});
