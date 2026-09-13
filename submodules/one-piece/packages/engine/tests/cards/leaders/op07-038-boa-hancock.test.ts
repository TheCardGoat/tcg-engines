import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03ThreeThousandWorlds057,
  op07BoaHancock038,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-038 Boa Hancock", () => {
  test("draws when its own effect removes a Character while its hand is at five or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07BoaHancock038,
        hand: [op03ThreeThousandWorlds057],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: 4,
      },
      { character: [eb01Doma005] },
    );
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const removedId = engine.findCardInZone("north", "character", eb01Doma005);
    const opposingDeckBefore = engine.getView("south").players.north.deckCount;

    engine.playCard(op03ThreeThousandWorlds057);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [removedId] }, "south");
    // "This effect can be activated when a Character is removed…" is optional.
    engine.accept("south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(view.players.north.deckCount).toBe(opposingDeckBefore + 1);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline the optional draw when a Character is removed by its effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07BoaHancock038,
        hand: [op03ThreeThousandWorlds057],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: 4,
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      { character: [eb01Doma005] },
    );
    const removedId = engine.findCardInZone("north", "character", eb01Doma005);
    const deckTopId = engine.findCardInZone("south", "deck", eb01Doma005);
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const deckBefore = engine.getView("south").players.south.deckCount;
    const handBefore = engine.getView("south").players.south.hand.length;

    // Own effect removes a Character (whenLeaving). Attacker fixture keeps subject-bound attack opener visible.
    engine.playCard(op03ThreeThousandWorlds057);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [removedId] }, "south");
    expect(engine.pendingDecision("effectOptional", "south").kind).toBe("confirm");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(deckTopId);
    expect(view.players.south.hand.length).toBe(handBefore - 1);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
    // Subject leader remains; do not draw.
    expect(view.players.south.leader.cardId).toBe(op07BoaHancock038.id);

    // Continue the turn with a subject-bound attack path (also satisfies attack opener family).
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore);
  });
});
