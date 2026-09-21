import { describe, expect, test } from "vite-plus/test";
import { op13Sabo004, pSabo105 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

const OPPONENTS_TURN = { firstPlayer: "south", activeSeat: "north" } as const;

describe("P-105 Sabo — Revolutionary Army conditional", () => {
  test("under a {Revolutionary Army} Leader it gains [Blocker] and +4 cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13Sabo004,
        character: [{ card: pSabo105 }],
        activeDon: 5,
      },
      { character: [{ cardId: "OP13-013", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const saboId = engine.findCardInZone("south", "character", pSabo105);
    const sabo = (e: OnePieceTestEngine) =>
      e.getView("south").players.south.characters.find((c) => c?.instanceId === saboId);

    // Printed cost 4, +4 under the RA Leader.
    expect(sabo(engine)?.cost).toBe(8);
    expect(sabo(engine)?.rested).toBe(false);

    engine.declareAttack(
      engine.findCardInZone("north", "character", "OP13-013"),
      engine.leader("south"),
      "north",
    );
    const block = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (block?.kind !== "selectEntity") throw new Error("Expected the Blocker choice.");
    expect(block.candidates.map((candidate) => candidate.ref.id)).toContain(saboId);
    engine.resolveDecision("battleBlocker", { selectedIds: [saboId] }, "south");

    // The cost-1 attacker is fully blocked by the rested 6000-power Sabo:
    // no counter prompt follows and the Leader takes no damage.
    expect(engine.getView("south").players.south.lifeCount).toBe(5);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a {Revolutionary Army} Leader no [Blocker] or +4 cost applies", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: "OP13-001",
        character: [{ card: pSabo105 }],
        activeDon: 5,
      },
      { character: [{ cardId: "OP13-013", rested: false, playedOnTurn: 0 }] },
      OPPONENTS_TURN,
    );
    const saboId = engine.findCardInZone("south", "character", pSabo105);

    engine.declareAttack(
      engine.findCardInZone("north", "character", "OP13-013"),
      engine.leader("south"),
      "north",
    );

    const view = engine.getView("south");
    expect(view.players.south.characters.find((c) => c?.instanceId === saboId)?.cost).toBe(4);
    expect(view.prompts).toHaveLength(0);
  });
});
