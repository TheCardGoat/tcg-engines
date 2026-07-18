import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Shiki073 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-073 Shiki", () => {
  test("with eight DON!! on the field, draws before trashing one chosen hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Shiki073, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: 8,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op06Shiki073, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Shiki's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual([keptId, drawnId]);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [keptId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(keptId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with only seven DON!! on the field, does not draw or trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Shiki073, eb01Doma005],
      deck: [eb01Fourtricks025],
      activeDon: 7,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op06Shiki073, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptId]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("blocks an opponent's Leader attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op06Shiki073] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shikiId = engine.findCardInZone("south", "character", op06Shiki073);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shiki's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shikiId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shikiId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
