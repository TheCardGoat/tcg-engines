import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, prb02Marco008 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("PRB02-008 Marco", () => {
  test("blocks for its Leader and draws 2 when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02Marco008], deck: [eb01Doma005, eb01Fourtricks025] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marcoId = engine.findCardInZone("south", "character", prb02Marco008);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawnIds = engine.getState().players.south.deck.slice(0, 2);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [marcoId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(marcoId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
