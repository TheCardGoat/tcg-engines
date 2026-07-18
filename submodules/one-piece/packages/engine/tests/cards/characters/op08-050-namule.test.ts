import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op08Namule050 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-050 Namule", () => {
  test("draws two, then orders exactly two hand cards at the chosen deck end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08Namule050, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op08Namule050.cost,
    });
    const firstId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op08Namule050, "south");
    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (selection?.kind !== "selectEntity") throw new Error("Expected Namule's hand choice.");
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstId, secondId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    const order = engine.pendingDecision("effectReturnToDeckOrder", "south").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 2, max: 2 });
    engine.resolveDecision(
      "effectReturnToDeckOrder",
      { selectedIds: [secondId, firstId] },
      "south",
    );
    const position = engine.pendingDecision("effectDeckPosition", "south").steps[0];
    expect(position).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([secondId, firstId]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("is offered as the defending player's Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Namule050] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op08Namule050);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Namule's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
  });
});
