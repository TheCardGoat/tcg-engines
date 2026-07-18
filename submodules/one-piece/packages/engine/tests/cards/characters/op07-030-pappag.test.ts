import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06Camie025, op07Pappag030 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-030 Pappag", () => {
  test("gains Blocker only while its controller has a Camie Character", () => {
    const withCamie = OnePieceTestEngine.create(
      { character: [op07Pappag030, op06Camie025] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pappagId = withCamie.findCardInZone("south", "character", op07Pappag030);
    withCamie.declareAttack(
      withCamie.findCardInZone("north", "character", eb01MountainGod018),
      withCamie.leader("south"),
      "north",
    );
    const blocker = withCamie.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Pappag's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pappagId);

    const withoutCamie = OnePieceTestEngine.create(
      { character: [op07Pappag030] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    withoutCamie.declareAttack(
      withoutCamie.findCardInZone("north", "character", eb01MountainGod018),
      withoutCamie.leader("south"),
      "north",
    );
    expect(
      withoutCamie
        .getView("south")
        .decisions.some((decision) => decision.title.includes("Blocker")),
    ).toBe(false);
  });
});
