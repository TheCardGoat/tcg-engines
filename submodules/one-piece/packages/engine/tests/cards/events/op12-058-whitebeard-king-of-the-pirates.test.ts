import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02EdwardNewgate004,
  op12IWillMakeWhitebeardTheKingOfThePirates058,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-058 I Will Make Whitebeard the King of the Pirates", () => {
  test("Main publicly reveals and optionally plays the top cost-9 Whitebeard Pirates Character with Rush", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op12IWillMakeWhitebeardTheKingOfThePirates058],
        deck: [op02EdwardNewgate004, eb01Doma005],
        activeDon: 9,
      },
      { life: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const revealedId = engine.findCardInZone("south", "deck", op02EdwardNewgate004);

    engine.playCard(op12IWillMakeWhitebeardTheKingOfThePirates058);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [revealedId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    engine.declareAttack(revealedId, engine.leader("north"), "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === revealedId)?.rested,
    ).toBe(true);
    expect(
      engine
        .getView("north")
        .logs.some((entry) => entry.message.includes(op02EdwardNewgate004.name)),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one without entering the Main reveal interaction", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op12IWillMakeWhitebeardTheKingOfThePirates058],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
