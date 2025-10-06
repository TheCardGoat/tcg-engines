/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  donaldDuck,
  mickeyBraveLittleTailor,
  rapunzelGiftedWithHealing,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  goofyKnightForADay,
  madamMimSnake,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import {
  belleAccomplishedMystic,
  goofySuperGoof,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { visionSlab } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import {
  luisaMadrigalEntertainingMuscle,
  whiteRabbitRoyalHerald,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Vision Slab", () => {
  describe("**TRAPPED!** Damage counters can't be removed.", () => {
    it("Prevent Removing Damage", async () => {
      const testEngine = new TestEngine({
        play: [goofyKnightForADay, visionSlab],
        hand: [rapunzelGiftedWithHealing],
        inkwell: rapunzelGiftedWithHealing.cost,
      });

      await testEngine.setCardDamage(goofyKnightForADay, 5);
      await testEngine.playCard(rapunzelGiftedWithHealing, {
        targets: [goofyKnightForADay],
      });

      expect(testEngine.getCardModel(goofyKnightForADay).damage).toEqual(5);
    });

    it("Prevent Moving Damage", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: belleAccomplishedMystic.cost * 2 + madamMimSnake.cost,
          play: [goofySuperGoof, donaldDuck, visionSlab],
          hand: [belleAccomplishedMystic, madamMimSnake],
        },
        {
          play: [mickeyBraveLittleTailor, goofyKnightForADay],
        },
      );

      await testEngine.setCardDamage(donaldDuck, 2);
      await testEngine.playCard(
        belleAccomplishedMystic,
        {
          targets: [donaldDuck],
        },
        true,
      );
      await testEngine.resolveTopOfStack({
        targets: [goofyKnightForADay],
      });

      expect(testEngine.getCardModel(donaldDuck).damage).toBe(2);
      expect(testEngine.getCardModel(goofyKnightForADay).damage).toBe(0);
    });

    it("Applies to both players' cards", async () => {
      const testEngine = new TestEngine(
        {
          play: [whiteRabbitRoyalHerald],
          hand: [visionSlab],
          inkwell: visionSlab.cost,
        },
        {
          play: [luisaMadrigalEntertainingMuscle],
        },
      );

      const ownCharacter = testEngine.getCardModel(whiteRabbitRoyalHerald);
      const opponentsCard = testEngine.getCardModel(
        luisaMadrigalEntertainingMuscle,
      );

      expect(
        testEngine.store.effectStore.getAbilitiesForCard(ownCharacter),
      ).toHaveLength(0);
      expect(
        testEngine.store.effectStore.getAbilitiesForCard(opponentsCard),
      ).toHaveLength(0);

      await testEngine.playCard(visionSlab);

      expect(
        testEngine.store.effectStore.getAbilitiesForCard(ownCharacter).at(0)
          ?.name,
      ).toEqual("TRAPPED!");
      expect(
        testEngine.store.effectStore.getAbilitiesForCard(opponentsCard).at(0)
          ?.name,
      ).toEqual("TRAPPED!");
    });
  });

  describe("**DANGER REVEALED** At the start of your turn, if an opposing character has damage, gain 1 lore. ", () => {
    it("Gives 1 lore if opponent has damaged character", async () => {
      const testEngine = new TestEngine(
        {
          play: [whiteRabbitRoyalHerald],
        },
        {
          play: [luisaMadrigalEntertainingMuscle, visionSlab],
        },
      );

      await testEngine.setCardDamage(whiteRabbitRoyalHerald, 1);

      expect(testEngine.getLoreForPlayer("player_two")).toEqual(0);
      await testEngine.passTurn();
      expect(testEngine.getLoreForPlayer("player_two")).toEqual(1);
    });
  });
});
