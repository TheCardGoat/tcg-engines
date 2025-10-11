import { describe, expect, it } from "bun:test";
import { peterPanFearless } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { peteBadGuy } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { peteWrestlingChamp } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pete - Wrestling Champ", () => {
  describe("**RE-PETE** {E} - Reveal the top card of your deck. If it’s a character card named Pete, you may play it for free.", () => {
    it("Pete on top", () => {
      const testStore = new TestStore({
        play: [peteWrestlingChamp],
        deck: [peteBadGuy],
      });

      const cardUnderTest = testStore.getCard(peteWrestlingChamp);

      const target = testStore.getCard(peteBadGuy);

      cardUnderTest.activate();
      testStore.resolveOptionalAbility();

      expect(target.zone).toEqual("play");
    });

    it("Peter Pan on top", () => {
      const testStore = new TestStore({
        play: [peteWrestlingChamp],
        deck: [peterPanFearless],
      });

      const cardUnderTest = testStore.getCard(peteWrestlingChamp);

      const target = testStore.getCard(peterPanFearless);

      cardUnderTest.activate();

      expect(target.zone).toEqual("deck");
      expect(target.meta.revealed).toEqual(true);
    });
  });
});
