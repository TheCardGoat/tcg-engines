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

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([drawnId]);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(view.players.north.deckCount).toBe(opposingDeckBefore + 1);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
