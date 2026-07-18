import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03MissDoublefingerZala046,
  eb03MissValentineMikita047,
  eb03Stussy043,
  op01EustassCaptainKid051,
  op02Tsuru106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-046 Miss Doublefinger(Zala)", () => {
  test("draws on play when a Character has been reduced to cost 0", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Tsuru106, eb03MissDoublefingerZala046],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 5,
      },
      {
        character: [eb03MissValentineMikita047],
      },
    );
    const targetId = engine.findCardInZone("north", "character", eb03MissValentineMikita047);

    engine.playCard(op02Tsuru106, "south");
    const reduction = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(reduction?.kind).toBe("selectEntity");
    if (reduction?.kind !== "selectEntity") {
      throw new Error("Expected Tsuru's cost-reduction target.");
    }
    expect(reduction.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    engine.playCard(eb03MissDoublefingerZala046, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.players.south.hand[0]?.cardId).toBe(eb01Doma005.id);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("draws with a cost-8 Character present, but not with only a cost-7 Character", () => {
    const eligible = OnePieceTestEngine.create({
      hand: [eb03MissDoublefingerZala046],
      character: [op01EustassCaptainKid051],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 4,
    });

    eligible.playCard(eb03MissDoublefingerZala046, "south");
    expect(eligible.getView("south").players.south.hand).toHaveLength(1);
    expect(eligible.getView("south").players.south.deckCount).toBe(1);

    const ineligible = OnePieceTestEngine.create({
      hand: [eb03MissDoublefingerZala046],
      character: [eb03Stussy043],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: 4,
    });

    ineligible.playCard(eb03MissDoublefingerZala046, "south");
    expect(ineligible.getView("south").players.south.hand).toHaveLength(0);
    expect(ineligible.getView("south").players.south.deckCount).toBe(2);
    expect(ineligible.getView("south").prompts).toHaveLength(0);
  });

  test("trashes the top 2 cards of its controller's deck when K.O.'d", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb03MissDoublefingerZala046, rested: true }],
        deck: [eb01Doma005, eb03MissValentineMikita047, eb01Doma005, eb01Doma005],
      },
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const zalaId = engine.findCardInZone("south", "character", eb03MissDoublefingerZala046);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, zalaId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(zalaId);
    expect(view.players.south.trash).toHaveLength(3);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
