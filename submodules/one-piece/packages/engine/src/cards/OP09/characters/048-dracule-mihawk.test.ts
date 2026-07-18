import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09DraculeMihawk048 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-048 Dracule Mihawk", () => {
  test("on play draws two cards, then trashes the selected physical hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09DraculeMihawk048, eb01MountainGod018],
      activeDon: op09DraculeMihawk048.cost,
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
    });
    const existingHandId = engine.findCardInZone("south", "hand", eb01MountainGod018);

    engine.playCard(op09DraculeMihawk048, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Mihawk's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(existingHandId);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [existingHandId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(existingHandId);
    expect(view.prompts).toHaveLength(0);
  });

  test("rests as a Blocker and redirects an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09DraculeMihawk048] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mihawkId = engine.findCardInZone("south", "character", op09DraculeMihawk048);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Mihawk's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(mihawkId);
    engine.resolveDecision("battleBlocker", { selectedIds: [mihawkId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === mihawkId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(mihawkId);
    expect(view.prompts).toHaveLength(0);
  });
});
