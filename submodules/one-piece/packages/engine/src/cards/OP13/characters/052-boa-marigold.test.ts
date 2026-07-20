import {
  eb01Doma005,
  op01Kaido094,
  op07BoaHancock038,
  op13BoaHancock051,
  op14eb04BoaHancockOp14112112,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13BoaMarigold052 } from "../../../../../cards/src/cards/OP13/characters/052-boa-marigold.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-052 Boa Marigold", () => {
  test("with a Boa Hancock Leader plays a selected cost-6-or-less Boa Hancock from hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      hand: [op13BoaMarigold052, op13BoaHancock051, op14eb04BoaHancockOp14112112, eb01Doma005],
      activeDon: op13BoaMarigold052.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op13BoaHancock051);
    const tooExpensiveId = engine.findCardInZone("south", "hand", op14eb04BoaHancockOp14112112);
    const wrongNameId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13BoaMarigold052, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Marigold's hand-play choice.");
    const candidates = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toContain(eligibleId);
    expect(candidates).not.toContain(tooExpensiveId);
    expect(candidates).not.toContain(wrongNameId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("blocks an attack through the defender-owned public choice", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op13BoaMarigold052] },
      { character: [{ card: op01Kaido094, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const marigoldId = engine.findCardInZone("south", "character", op13BoaMarigold052);
    const attackerId = engine.findCardInZone("north", "character", op01Kaido094);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Marigold's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(marigoldId);
    engine.resolveDecision("battleBlocker", { selectedIds: [marigoldId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(marigoldId);
    expect(view.prompts).toHaveLength(0);
  });
});
