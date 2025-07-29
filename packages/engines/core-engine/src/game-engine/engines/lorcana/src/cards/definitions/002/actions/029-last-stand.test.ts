/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  aladdinCorneredSwordman,
  liloGalacticHero,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { lastStand } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Last Stand", () => {
  describe("Banish chosen character who was challenged this turn.", () => {
    it("Does NOT Banish a character that has not been challenged", () => {
      const testStore = new TestStore(
        {
          inkwell: lastStand.cost,
          hand: [lastStand],
          play: [liloGalacticHero],
        },
        {
          play: [goofyKnightForADay, aladdinCorneredSwordman],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId("hand", lastStand.id);
      const target = testStore.getByZoneAndId(
        "play",
        aladdinCorneredSwordman.id,
        "player_two",
      );
      const challenger = testStore.getByZoneAndId("play", liloGalacticHero.id);
      const defender = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
        "player_two",
      );

      target.updateCardMeta({ exerted: true });
      challenger.challenge(defender);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("play");
    });

    it("Does NOT Banish a character that has not been challenged", () => {
      const testStore = new TestStore(
        {
          inkwell: lastStand.cost,
          hand: [lastStand],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId("hand", lastStand.id);
      const target = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
        "player_two",
      );

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("play");
    });

    it("Banishes a character that has been challenged", () => {
      const testStore = new TestStore(
        {
          inkwell: lastStand.cost,
          hand: [lastStand],
          play: [liloGalacticHero],
        },
        {
          play: [goofyKnightForADay],
        },
      );

      const cardUnderTest = testStore.getByZoneAndId("hand", lastStand.id);
      const target = testStore.getByZoneAndId(
        "play",
        goofyKnightForADay.id,
        "player_two",
      );
      const challenger = testStore.getByZoneAndId("play", liloGalacticHero.id);

      target.updateCardMeta({ exerted: true });
      challenger.challenge(target);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toEqual("discard");
    });
  });
});
