import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Crocodile062,
  op01Mr3Galdino085,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-085 Mr.3 (Galdino)", () => {
  test("with a Baroque Works Leader stops a chosen low-cost Character through its next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Crocodile062,
        hand: [op01Mr3Galdino085],
        activeDon: op01Mr3Galdino085.cost,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op01Mr3Galdino085, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Mr.3's attack restriction.");
    expect(target.min).toBe(0);
    expect(target.max).toBe(1);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    engine.endTurn("south");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "north",
        attackerId: targetId,
        targetId: engine.leader("south"),
      }).accepted,
    ).toBe(false);

    engine.endTurn("north");
    engine.endTurn("south");
    engine.declareAttack(targetId, engine.leader("south"), "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === excludedId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("without a Baroque Works Leader creates no attack-restriction choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op01Mr3Galdino085],
        activeDon: op01Mr3Galdino085.cost,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.playCard(op01Mr3Galdino085, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
