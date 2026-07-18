import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op03Fossa010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-010 Fossa", () => {
  test("is offered through the public Blocker decision and becomes the attack target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op03Fossa010] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const fossaId = engine.findCardInZone("south", "character", op03Fossa010);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Fossa's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(fossaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [fossaId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      fossaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
