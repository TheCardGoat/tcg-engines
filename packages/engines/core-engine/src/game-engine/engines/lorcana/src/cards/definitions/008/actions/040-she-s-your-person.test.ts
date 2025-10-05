import { describe, expect, it } from "bun:test";
import { mickeyMouseMusketeer } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  mickeyMouseGiantMouse,
  shesYourPerson,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("She's Your Person", () => {
  describe("Choose one:", () => {
    it("- Remove up to 3 damage from chosen character.", async () => {
      const testEngine = new TestEngine({
        inkwell: shesYourPerson.cost,
        play: [mickeyMouseGiantMouse],
        hand: [shesYourPerson],
      });

      await testEngine.setCardDamage(mickeyMouseGiantMouse, 5);

      await testEngine.playCard(shesYourPerson);

      await testEngine.resolveTopOfStack({
        mode: "1",
      });

      await testEngine.resolveTopOfStack({
        targets: [mickeyMouseGiantMouse],
      });

      expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toEqual(2);
    });

    it("- Remove up to 3 damage from each of your characters with Bodyguard.", async () => {
      const testEngine = new TestEngine({
        inkwell: shesYourPerson.cost,
        play: [mickeyMouseGiantMouse, mickeyMouseMusketeer],
        hand: [shesYourPerson],
      });

      await testEngine.setCardDamage(mickeyMouseGiantMouse, 5);
      await testEngine.setCardDamage(mickeyMouseMusketeer, 4);

      await testEngine.playCard(shesYourPerson);

      await testEngine.resolveTopOfStack({
        mode: "2",
      });

      expect(testEngine.getCardModel(mickeyMouseGiantMouse).damage).toEqual(2);
      expect(testEngine.getCardModel(mickeyMouseMusketeer).damage).toEqual(1);
    });
  });
});
