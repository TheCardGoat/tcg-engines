import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op13Higuma013,
  prb01QueenFullArt005,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-005 Queen", () => {
  test("optionally returns one DON!! before drawing two and trashing one hand card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [prb01QueenFullArt005, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, op13Higuma013],
      activeDon: prb01QueenFullArt005.cost + 1,
    });
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);
    const discardedId = drawnIds[0]!;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(prb01QueenFullArt005, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Queen's hand trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([retainedId, ...drawnIds]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([retainedId, drawnIds[1]!]),
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("can block an attack aimed at its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb01QueenFullArt005] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const queenId = engine.findCardInZone("south", "character", prb01QueenFullArt005);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [queenId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(queenId);
    expect(view.prompts).toHaveLength(0);
  });
});
