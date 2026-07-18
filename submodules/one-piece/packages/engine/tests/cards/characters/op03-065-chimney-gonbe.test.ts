import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03ChimneyGonbe065 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-065 Chimney & Gonbe", () => {
  test("blocks a Leader attack and becomes the battle target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03ChimneyGonbe065] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op03ChimneyGonbe065);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Chimney & Gonbe's Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.some((card) => card?.instanceId === blockerId)).toBe(
      false,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
    expect(view.prompts).toHaveLength(0);
  });
});
