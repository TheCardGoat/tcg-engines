import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaFightingPrince } from "./192-simba-fighting-prince";

const handCard1 = createMockCharacter({
  id: "simba-fp-hand-card-1",
  name: "Hand Card 1",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const handCard2 = createMockCharacter({
  id: "simba-fp-hand-card-2",
  name: "Hand Card 2",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const targetCharacter = createMockCharacter({
  id: "simba-fp-target-character",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const weakDefender = createMockCharacter({
  id: "simba-fp-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Simba - Fighting Prince", () => {
  describe("STEP DOWN OR FIGHT - When you play this character and whenever he banishes another character in a challenge during your turn, you may choose one: Draw 2 cards, then choose and discard 2 cards. Deal 2 damage to chosen character.", () => {
    it("on play: choosing option 0 draws 2 cards then discards 2", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: simbaFightingPrince.cost,
        hand: [simbaFightingPrince, handCard1, handCard2],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(simbaFightingPrince)).toBeSuccessfulCommand();

      // Optional ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept optional, choose mode 0 (draw 2, then discard 2)
      // After accepting, draw 2 happens then discard selection is pending
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(simbaFightingPrince, { resolveOptional: true, choiceIndex: 0 }),
      ).toBeSuccessfulCommand();

      // Now we need to discard 2 cards — pending effect
      const pendingEffects = testEngine.asPlayerOne().getPendingEffects();
      expect(pendingEffects).toHaveLength(1);

      const discardCard1Id = testEngine.findCardInstanceId(handCard1, "hand", "player_one");
      const discardCard2Id = testEngine.findCardInstanceId(handCard2, "hand", "player_one");

      expect(
        testEngine.asPlayerOne().resolveEffect(pendingEffects[0]!.id, {
          targets: [discardCard1Id, discardCard2Id],
        }),
      ).toBeSuccessfulCommand();

      // hand had simba + handCard1 + handCard2. Played simba → hand has 2. Drew 2 → hand has 4. Discarded 2 → hand has 2.
      expect(testEngine.asPlayerOne().getCardZone(handCard1)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(handCard2)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(simbaFightingPrince)).toBe("play");
    });

    it("on play: choosing option 1 deals 2 damage to chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: simbaFightingPrince.cost,
          hand: [simbaFightingPrince],
          deck: 1,
        },
        {
          play: [targetCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(simbaFightingPrince)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaFightingPrince, {
          resolveOptional: true,
          choiceIndex: 1,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: targetCharacter, value: 2 });
    });

    it("on play: declining the optional ability does nothing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: simbaFightingPrince.cost,
          hand: [simbaFightingPrince],
          deck: 1,
        },
        {
          play: [targetCharacter],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(simbaFightingPrince)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(simbaFightingPrince, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: targetCharacter, value: 0 });
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("banish-in-challenge during your turn triggers the optional ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaFightingPrince, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }],
          deck: 1,
        },
      );

      // Simba challenges the weak defender (strength 5 vs willpower 1 — defender dies)
      expect(
        testEngine.asPlayerOne().challenge(simbaFightingPrince, weakDefender),
      ).toBeSuccessfulCommand();

      // Weak defender should be banished
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Triggered ability should fire
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(simbaFightingPrince, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("banish-in-challenge: choosing option 1 deals 2 damage to chosen character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaFightingPrince, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: weakDefender, exerted: true }, targetCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(simbaFightingPrince, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaFightingPrince, {
          resolveOptional: true,
          choiceIndex: 1,
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: targetCharacter, value: 2 });
    });
  });
});
