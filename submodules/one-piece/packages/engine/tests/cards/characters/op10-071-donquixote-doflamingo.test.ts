import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op09DonquixoteDoflamingo031,
  op10DonquixoteDoflamingo071,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-071 Donquixote Doflamingo", () => {
  test("may return one DON!! to play an included Donquixote Pirates cost-5 Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10DonquixoteDoflamingo071, op09DonquixoteDoflamingo031],
      activeDon: op10DonquixoteDoflamingo071.cost + 1,
    });
    const playId = engine.findCardInZone("south", "hand", op09DonquixoteDoflamingo031);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op10DonquixoteDoflamingo071, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Doflamingo's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(playId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(playId);
    expect(view.prompts).toHaveLength(0);
  });

  test("once per turn rests one DON!! to replace it from the DON!! deck as active", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10DonquixoteDoflamingo071], activeDon: 1, donDeckCount: 1 },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackers = engine
      .getView("north")
      .players.north.characters.flatMap((card) => (card ? [card.instanceId] : []));

    engine.declareAttack(attackers[0]!, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      donDeckCount: 0,
    });

    engine.declareAttack(attackers[1]!, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      restedDon: 1,
      donDeckCount: 0,
    });
  });
});
