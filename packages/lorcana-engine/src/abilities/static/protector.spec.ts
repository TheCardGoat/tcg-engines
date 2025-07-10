/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { fireTheCannons } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import {
  beastSelflessProtector,
  owlLogicalLecturer,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Protector", () => {
  it("Damage from action (Single Target)", () => {
    const testStore = new TestStore(
      {
        inkwell: fireTheCannons.cost,
        hand: [fireTheCannons],
      },
      {
        play: [beastSelflessProtector, liloMakingAWish],
      },
    );

    const removal = testStore.getByZoneAndId("hand", fireTheCannons.id);
    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      beastSelflessProtector.id,
      "player_two",
    );
    const target = testStore.getByZoneAndId(
      "play",
      liloMakingAWish.id,
      "player_two",
    );

    removal.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(cardUnderTest.damage).toEqual(2);
    expect(target.damage).toEqual(0);
  });

  // it.todo("Damage from action (Multi Target), more damage than health");

  it("Damage from action (Multi Target)", () => {
    const testStore = new TestStore(
      {
        inkwell: grabYourSword.cost,
        hand: [grabYourSword],
      },
      {
        play: [beastSelflessProtector, liloMakingAWish, owlLogicalLecturer],
      },
    );

    const removal = testStore.getByZoneAndId("hand", grabYourSword.id);
    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      beastSelflessProtector.id,
      "player_two",
    );
    const target = testStore.getByZoneAndId(
      "play",
      liloMakingAWish.id,
      "player_two",
    );
    const target2 = testStore.getByZoneAndId(
      "play",
      owlLogicalLecturer.id,
      "player_two",
    );

    removal.playFromHand();

    expect(cardUnderTest.damage).toEqual(2 + 2 + 2);
    expect(target.damage).toEqual(0);
    expect(target2.damage).toEqual(0);
  });

  it("Damage from challenge", () => {
    const testStore = new TestStore(
      {
        inkwell: grabYourSword.cost,
        hand: [grabYourSword],
        play: [owlLogicalLecturer],
      },
      {
        play: [beastSelflessProtector, liloMakingAWish],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      beastSelflessProtector.id,
      "player_two",
    );
    const defender = testStore.getByZoneAndId(
      "play",
      liloMakingAWish.id,
      "player_two",
    );
    const attacker = testStore.getByZoneAndId("play", owlLogicalLecturer.id);

    defender.updateCardMeta({ exerted: true });
    attacker.challenge(defender);

    expect(cardUnderTest.damage).toEqual(attacker.strength);
    expect(attacker.damage).toEqual(defender.strength);
    expect(defender.damage).toEqual(0);
  });
});
