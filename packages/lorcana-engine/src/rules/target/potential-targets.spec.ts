/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import {
  beastForbiddingRecluse,
  beastTragicHero,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Shifted Character", () => {
  it("[Support] should not be able to target the shifted character", () => {
    const testStore = new TestStore({
      play: [beastForbiddingRecluse],
      inkwell: 3,
      hand: [beastTragicHero, heiheiBoatSnack],
    });

    const shifter = testStore.getByZoneAndId("hand", beastTragicHero.id);
    const shifted = testStore.getByZoneAndId("play", beastForbiddingRecluse.id);
    const charWithSupport = testStore.getByZoneAndId(
      "hand",
      heiheiBoatSnack.id,
    );

    testStore.store.cardStore.shiftCard(shifter, shifted);
    charWithSupport.quest();
    testStore.resolveOptionalAbility();

    const potentialTargets =
      testStore.store.stackLayerStore.topLayer?.getPotentialTargets();

    if (!potentialTargets) {
      throw new Error("No potential targets");
    }

    expect(potentialTargets).toHaveLength(1);
    expect(potentialTargets[0]?.fullName).toEqual(shifter.fullName);
  });

  it("[Target effects] should not be able to target the shifted character", () => {
    const testStore = new TestStore({
      play: [beastForbiddingRecluse],
      inkwell: 3 + fireTheCannons.cost,
      hand: [beastTragicHero, fireTheCannons],
    });

    const shifter = testStore.getByZoneAndId("hand", beastTragicHero.id);
    const shifted = testStore.getByZoneAndId("play", beastForbiddingRecluse.id);
    const targetEffect = testStore.getByZoneAndId("hand", fireTheCannons.id);

    testStore.store.cardStore.shiftCard(shifter, shifted);
    targetEffect.playFromHand();

    const potentialTargets =
      testStore.store.stackLayerStore.topLayer?.getPotentialTargets();

    if (!potentialTargets) {
      throw new Error("No potential targets");
    }

    expect(potentialTargets).toHaveLength(1);
    expect(potentialTargets[0]?.fullName).toEqual(shifter.fullName);
  });

  it("[Area effects] should not be able to target the shifted character", () => {
    const testStore = new TestStore(
      {
        play: [beastForbiddingRecluse],
        inkwell: 3,
        hand: [beastTragicHero],
      },
      {
        deck: 1,
        inkwell: grabYourSword.cost,
        hand: [grabYourSword],
      },
    );

    const shifter = testStore.getByZoneAndId("hand", beastTragicHero.id);
    const shifted = testStore.getByZoneAndId("play", beastForbiddingRecluse.id);
    testStore.store.cardStore.shiftCard(shifter, shifted);

    testStore.passTurn();

    const areaEffect = testStore.getByZoneAndId(
      "hand",
      grabYourSword.id,
      "player_two",
    );
    areaEffect.playFromHand();

    expect(shifter.meta.damage).toEqual(2);
    expect(shifted.meta.damage).toBeFalsy();
  });
});
