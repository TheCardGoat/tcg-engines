import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03Pearl031 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-031 Pearl", () => {
  test("is offered as a public Blocker and becomes the attack target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Pearl031] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const pearlId = engine.findCardInZone("south", "character", op03Pearl031);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Pearl's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pearlId);
    engine.resolveDecision("battleBlocker", { selectedIds: [pearlId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(pearlId);
    expect(view.prompts).toHaveLength(0);
  });
});
