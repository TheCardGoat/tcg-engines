import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06DouglasBullet010, op06Uta001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-010 Douglas Bullet", () => {
  test("is offered as a Blocker only with a FILM Leader", () => {
    const withFilm = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op06Uta001,
        character: [op06DouglasBullet010],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = withFilm.findCardInZone("south", "character", eb01MountainGod018);
    const bulletId = withFilm.findCardInZone("north", "character", op06DouglasBullet010);
    withFilm.declareAttack(attackerId, withFilm.leader("north"), "south");
    const blocker = withFilm.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity")
      throw new Error("Expected Douglas Bullet's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(bulletId);

    const withoutFilm = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op06DouglasBullet010] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    withoutFilm.declareAttack(
      withoutFilm.findCardInZone("south", "character", eb01MountainGod018),
      withoutFilm.leader("north"),
      "south",
    );
    expect(withoutFilm.getView("north").decisions).toHaveLength(0);
  });
});
