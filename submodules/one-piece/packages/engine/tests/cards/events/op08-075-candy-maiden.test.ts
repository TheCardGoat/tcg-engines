import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05BartholomewKuma011,
  op08CandyMaiden075,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-075 Candy Maiden", () => {
  test("Main returns a chosen DON!!, rests the cost-2 boundary, and turns every own Life face-down", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08CandyMaiden075],
        life: [
          { card: eb01Doma005, faceUp: true, publicKnowledge: true },
          { card: op05BartholomewKuma011, faceUp: true, publicKnowledge: true },
        ],
        activeDon: 2,
        restedDon: 1,
      },
      { character: [op05BartholomewKuma011] },
    );
    const targetId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const lifeIds = [...engine.getState().players.south.life];
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op08CandyMaiden075);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["rested-don:0"] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.rested,
    ).toBe(true);
    expect(lifeIds.map((instanceId) => engine.getState().cards[instanceId]?.faceUp)).toEqual([
      false,
      false,
    ]);
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger adds up to 1 DON!! card active", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op08CandyMaiden075], donDeckCount: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(op08CandyMaiden075.id);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
