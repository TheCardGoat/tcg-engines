import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01BoaHancock078,
  op01RoronoaZoro001,
  op07BoaHancock038,
} from "@tcg/op-cards";
import { op13BoaHancock051 } from "../../../../../cards/src/cards/OP13/characters/051-boa-hancock.ts";
import { op13BoaSandersonia050 } from "../../../../../cards/src/cards/OP13/characters/050-boa-sandersonia.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-050 Boa Sandersonia", () => {
  test("with a Boa Hancock Leader, plays the selected cost-3 Boa Hancock from its controller's hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      hand: [op13BoaSandersonia050, op13BoaHancock051, op01BoaHancock078, eb01Doma005],
      activeDon: op13BoaSandersonia050.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op13BoaHancock051);
    const expensiveId = engine.findCardInZone("south", "hand", op01BoaHancock078);
    const wrongNameId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13BoaSandersonia050, "south");
    const decision = engine.pendingDecision("effectPlaySelection", "south");
    expect(decision.actorId).toBe("south");
    const play = decision.steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Sandersonia's play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongNameId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([expensiveId, wrongNameId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may play no card, and offers no play without the named Leader", () => {
    const declined = OnePieceTestEngine.create({
      leaderCardId: op07BoaHancock038,
      hand: [op13BoaSandersonia050, op13BoaHancock051],
      activeDon: op13BoaSandersonia050.cost,
    });
    const declinedHancockId = declined.findCardInZone("south", "hand", op13BoaHancock051);

    declined.playCard(op13BoaSandersonia050, "south");
    declined.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(declined.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      declinedHancockId,
    );
    expect(declined.getView("south").prompts).toHaveLength(0);

    const wrongLeader = OnePieceTestEngine.create({
      leaderCardId: op01RoronoaZoro001,
      hand: [op13BoaSandersonia050, op13BoaHancock051],
      activeDon: op13BoaSandersonia050.cost,
    });
    const gatedHancockId = wrongLeader.findCardInZone("south", "hand", op13BoaHancock051);

    wrongLeader.playCard(op13BoaSandersonia050, "south");
    expect(
      wrongLeader.getView("south").players.south.hand.map((card) => card.instanceId),
    ).toContain(gatedHancockId);
    expect(wrongLeader.getView("south").prompts).toHaveLength(0);
  });
});
