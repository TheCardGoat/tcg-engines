import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04Leo091,
  op04Rebecca039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-091 Leo", () => {
  test("with a Dressrosa Leader, may rest it to K.O. a cost-1 Character and mill two", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op04Leo091],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op04Leo091.cost,
      },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const milledIds = engine.getState().players.south.deck.slice(0, 2);

    engine.playCard(op04Leo091, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Leo's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(eligibleId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(milledIds),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline, while a non-Dressrosa Leader still pays to mill without K.O.'ing", () => {
    const declined = OnePieceTestEngine.create(
      {
        leaderCardId: op04Rebecca039,
        hand: [op04Leo091],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op04Leo091.cost,
      },
      { character: [eb01Doma005] },
    );
    const declinedTargetId = declined.findCardInZone("north", "character", eb01Doma005);

    declined.playCard(op04Leo091, "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(declined.getView("south").players.south.leader.rested).toBe(false);
    expect(declined.getView("south").players.south.deckCount).toBe(2);
    expect(
      declined.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(declinedTargetId);

    const wrongLeader = OnePieceTestEngine.create(
      {
        hand: [op04Leo091],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op04Leo091.cost,
      },
      { character: [eb01Doma005] },
    );
    const wrongLeaderTargetId = wrongLeader.findCardInZone("north", "character", eb01Doma005);

    wrongLeader.playCard(op04Leo091, "south");
    wrongLeader.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const view = wrongLeader.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(view.players.south.deckCount).toBe(0);
    expect(view.players.south.trash).toHaveLength(2);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(
      wrongLeaderTargetId,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
