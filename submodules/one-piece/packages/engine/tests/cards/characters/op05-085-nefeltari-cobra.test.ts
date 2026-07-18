import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05NefeltariCobra085,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-085 Nefeltari Cobra", () => {
  test("trashes the top deck card on play, then blocks through the public battle decision", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05NefeltariCobra085],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op05NefeltariCobra085.cost,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "south" },
    );
    const topDeckId = engine.getState().players.south.deck[0]!;
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op05NefeltariCobra085, "south");
    const cobraId = engine.findCardInZone("south", "character", op05NefeltariCobra085);
    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(topDeckId);
    expect(view.players.south.deckCount).toBe(1);

    engine.endTurn("south");
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Cobra's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(cobraId);
    engine.resolveDecision("battleBlocker", { selectedIds: [cobraId] }, "south");

    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(cobraId);
    expect(view.prompts).toHaveLength(0);
  });
});
