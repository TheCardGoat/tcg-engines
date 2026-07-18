import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op09LuckyRoux015,
  op09NobodyHurtsAFriendOfMine019,
  op09Shanks001,
  op09Yasopp013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-019 Nobody Hurts a Friend of Mine!!!!", () => {
  test("Main accepts the included Leader type, applies −3000, then checks the updated field before drawing", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09Shanks001,
        hand: [op09NobodyHurtsAFriendOfMine019],
        deck: [eb01Doma005],
        activeDon: 2,
      },
      { character: [op09Yasopp013, op09LuckyRoux015] },
    );
    const reducedId = engine.findCardInZone("north", "character", op09Yasopp013);
    const remainingThresholdId = engine.findCardInZone("north", "character", op09LuckyRoux015);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op09NobodyHurtsAFriendOfMine019);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [reducedId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === reducedId)?.power,
    ).toBe(3000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === remainingThresholdId)
        ?.power,
    ).toBe(5000);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one without the Main Leader gate or DON!! payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op09NobodyHurtsAFriendOfMine019],
        deck: [eb01Doma005, op09LuckyRoux015, op09Yasopp013],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawnId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
