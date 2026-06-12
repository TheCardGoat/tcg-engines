import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  dragonFire,
  liloMakingAWish,
  liloGalacticHero,
  grabYourSword,
  bePrepared,
} from "../../001";
import { liloJuniorCakeDecorator } from "../../005";
import { lyleTiberiusRourkeCunningMercenary } from "./078-lyle-tiberius-rourke-cunning-mercenary";

describe("Lyle Tiberius Rourke - Cunning Mercenary", () => {
  describe("WELL, NOW YOU KNOW — When you play this character, chosen opposing character gains Reckless during their next turn.", () => {
    it("chosen opposing character gains Reckless during their next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: lyleTiberiusRourkeCunningMercenary.cost,
          hand: [lyleTiberiusRourkeCunningMercenary],
        },
        {
          play: [liloMakingAWish],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(lyleTiberiusRourkeCunningMercenary),
      ).toBeSuccessfulCommand();

      // Resolve the triggered ability via bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(lyleTiberiusRourkeCunningMercenary),
      ).toBeSuccessfulCommand();

      // Choose the opposing character as target
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [liloMakingAWish] }),
      ).toBeSuccessfulCommand();

      // Pass turn to opponent's turn
      testEngine.asServer().passTurn();

      // During opponent's next turn, the character should have Reckless
      expect(testEngine.hasKeyword(liloMakingAWish, "Reckless")).toBe(true);
    });
  });

  describe("THANKS FOR VOLUNTEERING — Whenever one of your other characters is banished, each opponent loses 1 lore.", () => {
    it("opponent loses 1 lore when your other character is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: dragonFire.cost,
        hand: [dragonFire],
        play: [lyleTiberiusRourkeCunningMercenary, liloMakingAWish],
      });

      testEngine.asServer().manualSetLore(PLAYER_TWO, 5);

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, { targets: [liloMakingAWish] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");
      expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
    });

    it("does not trigger when Lyle himself is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: dragonFire.cost,
        hand: [dragonFire],
        play: [lyleTiberiusRourkeCunningMercenary],
      });

      testEngine.asServer().manualSetLore(PLAYER_TWO, 5);

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [lyleTiberiusRourkeCunningMercenary],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(lyleTiberiusRourkeCunningMercenary)).toBe(
        "discard",
      );
      expect(testEngine.getLore(PLAYER_TWO)).toBe(5);
    });

    it("Grab Your Sword interaction - triggers for each banished character", () => {
      // Player two has Lyle (with 3 damage, will die at +2) + two Lilos (will die at +2)
      // Player one has 5 lore, plays Grab Your Sword dealing 2 damage to all opposing
      // Lyle triggers for each OTHER character banished → player one loses 2 lore
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: grabYourSword.cost,
          hand: [grabYourSword],
        },
        {
          play: [lyleTiberiusRourkeCunningMercenary, liloMakingAWish, liloGalacticHero],
        },
      );

      testEngine.asServer().manualSetLore(PLAYER_ONE, 5);
      // Pre-damage Lyle so he dies from 2 more damage (willpower 4, already has 3 damage)
      testEngine.asServer().manualSetDamage(lyleTiberiusRourkeCunningMercenary, 3);

      expect(testEngine.asPlayerOne().playCard(grabYourSword)).toBeSuccessfulCommand();

      // All three characters should be banished
      expect(testEngine.asPlayerOne().getCardZone(lyleTiberiusRourkeCunningMercenary)).toBe(
        "discard",
      );
      expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(liloGalacticHero)).toBe("discard");

      // Lyle (player two) triggered for 2 other characters banished → 2 bag effects
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(2);

      // Resolve all triggered bag effects (each causes player one to lose 1 lore)
      testEngine.asPlayerTwo().resolveAllBagEffects();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("Be Prepared interaction - banishes all characters, triggers for each non-Lyle banish", () => {
      // Player one has Lyle + 3 other characters, player two has 5 lore
      // Be Prepared banishes all → Lyle triggers for 3 others → player two loses 3
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: bePrepared.cost,
        hand: [bePrepared],
        play: [
          lyleTiberiusRourkeCunningMercenary,
          liloMakingAWish,
          liloGalacticHero,
          liloJuniorCakeDecorator,
        ],
      });

      testEngine.asServer().manualSetLore(PLAYER_TWO, 5);

      expect(testEngine.asPlayerOne().playCard(bePrepared)).toBeSuccessfulCommand();

      // All characters should be banished
      expect(testEngine.asPlayerOne().getCardZone(lyleTiberiusRourkeCunningMercenary)).toBe(
        "discard",
      );
      expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(liloGalacticHero)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(liloJuniorCakeDecorator)).toBe("discard");

      // Lyle triggered for 3 non-Lyle banishes → 3 bag effects (same ability auto-resolve)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Bag already drained; resolveAllBagEffects is a no-op when empty
      testEngine.asPlayerOne().resolveAllBagEffects();

      // Player two loses 3 lore
      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("Be Prepared with 2 Lyles - both trigger for each banish", () => {
      // Player one has 2 Lyles + 3 Lilos, player two has 10 lore
      // Be Prepared banishes all 5. Each Lyle triggers for 4 others → 8 total triggers
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: bePrepared.cost,
        hand: [bePrepared],
        play: [
          lyleTiberiusRourkeCunningMercenary,
          lyleTiberiusRourkeCunningMercenary,
          liloMakingAWish,
          liloGalacticHero,
          liloJuniorCakeDecorator,
        ],
      });

      testEngine.asServer().manualSetLore(PLAYER_TWO, 10);

      expect(testEngine.asPlayerOne().playCard(bePrepared)).toBeSuccessfulCommand();

      // Lyle1 triggers for 4 others + Lyle2 triggers for 4 others = 8 bag effects
      expect(testEngine.asPlayerOne().getBagCount()).toBe(8);

      // Resolve all triggered bag effects
      testEngine.asPlayerOne().resolveAllBagEffects();

      // 8 lore lost: 10 → 2
      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
