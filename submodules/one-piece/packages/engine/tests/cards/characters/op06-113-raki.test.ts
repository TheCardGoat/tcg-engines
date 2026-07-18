import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op06Raki113, op06Wyper114 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-113 Raki", () => {
  test("gains Blocker only from another Character whose type includes Shandian Warrior", () => {
    const eligible = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op06Raki113, op06Wyper114] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = eligible.findCardInZone("south", "character", eb01MountainGod018);
    const rakiId = eligible.findCardInZone("north", "character", op06Raki113);

    eligible.declareAttack(attackerId, eligible.leader("north"), "south");
    const blocker = eligible.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Raki's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(rakiId);
    eligible.resolveDecision("battleBlocker", { selectedIds: [rakiId] }, "north");
    expect(eligible.getView("north").players.north.lifeCount).toBe(4);
    expect(eligible.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      rakiId,
    );

    const alone = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { character: [op06Raki113, op06Raki113] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    alone.declareAttack(
      alone.findCardInZone("south", "character", eb01MountainGod018),
      alone.leader("north"),
      "south",
    );
    expect(alone.getView("north").decisions).toHaveLength(0);
  });
});
