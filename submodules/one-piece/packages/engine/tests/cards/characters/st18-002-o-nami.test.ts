import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03ONamiSt18002002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST18-002 O-Nami", () => {
  test("with eight DON!! trashes one chosen hand card before drawing two", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03ONamiSt18002002, eb01Doma005, eb01Fourtricks025],
      deck: [eb01MountainGod018, eb01Doma005],
      activeDon: 8,
    });
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const retainedId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const drawnIds = [...engine.getState().players.south.deck];

    engine.playCard(eb03ONamiSt18002002, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected O-Nami's hand trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardedId, retainedId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([retainedId, ...drawnIds]),
    );
    expect(view.players.south.deckCount).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("blocks an attack aimed at its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb03ONamiSt18002002] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", eb03ONamiSt18002002);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected O-Nami's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
  });
});
