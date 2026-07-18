import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op11Briscola090 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-090 Briscola", () => {
  test("is offered to its controller as a Blocker and protects Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Briscola090] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const briscolaId = engine.findCardInZone("south", "character", op11Briscola090);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Briscola as Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(briscolaId);
    engine.resolveDecision("battleBlocker", { selectedIds: [briscolaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(briscolaId);
    expect(view.prompts).toHaveLength(0);
  });
});
