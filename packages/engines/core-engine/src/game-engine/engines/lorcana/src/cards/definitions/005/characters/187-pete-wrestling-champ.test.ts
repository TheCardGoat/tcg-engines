/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { peterPanFearless } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { peteBadGuy } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { peteWrestlingChamp } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

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
