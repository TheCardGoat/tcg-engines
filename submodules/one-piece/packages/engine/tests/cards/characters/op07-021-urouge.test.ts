import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op07Urouge021 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-021 Urouge", () => {
  test("sets up to one rested DON!! active at the end of its controller's turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07Urouge021],
      restedDon: 2,
    });

    engine.endTurn("south");
    const count = engine.pendingDecision("effectSetActiveDon", "south").steps[0];
    expect(count).toMatchObject({
      kind: "chooseOption",
      options: [{ id: "0" }, { id: "1" }],
    });
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("uses Blocker through the opponent's public attack decision", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07Urouge021] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const urougeId = engine.findCardInZone("south", "character", op07Urouge021);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Urouge's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(urougeId);
    engine.resolveDecision("battleBlocker", { selectedIds: [urougeId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(urougeId);
    expect(view.prompts).toHaveLength(0);
  });
});
