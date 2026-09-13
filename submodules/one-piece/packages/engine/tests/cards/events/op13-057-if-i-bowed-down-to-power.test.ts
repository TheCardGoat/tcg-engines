import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb01TonyTonyChopper006,
  op13IfIBowedDownToPowerWhatSThePointInLiving057,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-057 If I Bowed Down to Power, What's the Point in Living?", () => {
  test("Main pays one DON!! and makes only the Leader's attacks unblockable at one Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13IfIBowedDownToPowerWhatSThePointInLiving057],
        activeDon: 2,
        life: 1,
      },
      { character: [eb01TonyTonyChopper006], life: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const blockerId = engine.findCardInZone("north", "character", eb01TonyTonyChopper006);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.playCard(op13IfIBowedDownToPowerWhatSThePointInLiving057);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore - 1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
  });

  test("Counter gives the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op13IfIBowedDownToPowerWhatSThePointInLiving057], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op13IfIBowedDownToPowerWhatSThePointInLiving057,
    );
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13IfIBowedDownToPowerWhatSThePointInLiving057],
        activeDon: 2,
        life: 1,
      },
      { character: [eb01TonyTonyChopper006], life: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    engine.playCard(op13IfIBowedDownToPowerWhatSThePointInLiving057, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
