import { describe, expect, it } from "bun:test";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { letItGo } from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs";
import { grammaTalaSpiritOfTheOcean } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { aladdinBraveRescuer } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { allFunnedOut } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import {
  donaldDuckFocusedFlatfoot,
  tipoGrowingSon,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gramma Tala - Spirit of the Ocean", () => {
  describe("**DO YOU KNOW WHO YOU ARE?** Whenever a card is put into your inkwell, gain 1 lore.", () => {
    it("Adding card from hand to inkwell should give +1 lore", () => {
      const testStore = new TestStore({
        play: [grammaTalaSpiritOfTheOcean],
        hand: [aladdinBraveRescuer, liloMakingAWish],
      });

      testStore.store.tableStore.getTable("player_one").lore = 0;

      const cardToPutInInkwell = testStore.getCard(aladdinBraveRescuer);
      cardToPutInInkwell.addToInkwell();

      expect(testStore.getPlayerLore()).toBe(1);
    });

    it("cards with effect that add to inkwell should also trigger ability", async () => {
      const testStore = new TestEngine({
        inkwell: 20,
        play: [grammaTalaSpiritOfTheOcean],
        hand: [
          tipoGrowingSon,
          liloMakingAWish,
          allFunnedOut,
          donaldDuckFocusedFlatfoot,
        ],
        deck: 1,
      });

      testStore.store.tableStore.getTable("player_one").lore = 0;

      const tipoCard = testStore.getCardModel(tipoGrowingSon);
      const allFunnedOutCard = testStore.getCardModel(allFunnedOut);
      const donaldDuckCard = testStore.getCardModel(donaldDuckFocusedFlatfoot);
      const cardToPutInInkwell = testStore.getCardModel(liloMakingAWish);

      await testStore.playCard(tipoCard);
      await testStore.resolveOptionalAbility();
      await testStore.resolveTopOfStack({ targets: [cardToPutInInkwell] });

      expect(testStore.getPlayerLore()).toBe(1);

      allFunnedOutCard.playFromHand();
      await testStore.resolveTopOfStack({ targets: [tipoCard] });

      expect(testStore.getPlayerLore()).toBe(2);

      await testStore.playCard(donaldDuckCard);
      await testStore.resolveOptionalAbility();

      expect(testStore.getPlayerLore()).toBe(3);
    });

    it("should gain lore when opponent puts cards into your inkwell", async () => {
      const testStore = new TestEngine(
        {
          inkwell: letItGo.cost,
          hand: [letItGo],
          lore: 0,
        },
        {
          play: [grammaTalaSpiritOfTheOcean, liloMakingAWish],
          lore: 0,
        },
      );

      const letItGoCard = testStore.getCardModel(letItGo);
      const cardToPutInInkwell = testStore.getCardModel(liloMakingAWish);
      letItGoCard.playFromHand();

      await testStore.resolveTopOfStack(
        { targets: [cardToPutInInkwell] },
        true,
      );

      expect(testStore.getPlayerLore("player_two")).toBe(1);
    });

    it("should not gain lore when opponent puts gramma into your inkweel", () => {
      const testStore = new TestStore(
        {
          inkwell: letItGo.cost,
          hand: [letItGo],
        },
        {
          play: [grammaTalaSpiritOfTheOcean],
        },
      );

      testStore.store.tableStore.getTable("player_two").lore = 0;

      const letItGoCard = testStore.getCard(letItGo);
      const cardToPutInInkwell = testStore.getCard(grammaTalaSpiritOfTheOcean);
      letItGoCard.playFromHand();

      testStore.resolveTopOfStack({ targets: [cardToPutInInkwell] });

      expect(testStore.getPlayerLore("player_two")).toBe(0);
    });
  });
});
