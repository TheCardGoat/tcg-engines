import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  prb01NarikaburaArrowJollyRogerFoil014,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST09-014 Narikabura Arrow reprint", () => {
  test("Counter at two Life gives a chosen opposing card -3000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005] },
      { hand: [prb01NarikaburaArrowJollyRogerFoil014], life: 2, activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", prb01NarikaburaArrowJollyRogerFoil014);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger trashes two chosen hand cards before adding the top deck card to Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [prb01NarikaburaArrowJollyRogerFoil014], hand: [eb01Doma005, eb01Doma005], deck: 6 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const paymentIds = engine.getState().players.north.hand;
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");
    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(paymentIds),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
