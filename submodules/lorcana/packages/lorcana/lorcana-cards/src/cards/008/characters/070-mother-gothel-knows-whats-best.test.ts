import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { motherGothelKnowsWhatsBest } from "./070-mother-gothel-knows-whats-best";

const ally = createMockCharacter({
  id: "mg-kwb-ally",
  name: "Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const allyWithResist = createMockCharacter({
  id: "mg-kwb-ally-resist",
  name: "Ally With Resist",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  abilities: [{ id: "mg-kwb-resist", keyword: "Resist", type: "keyword" as const, value: 1 }],
});

const opponentDefender = createMockCharacter({
  id: "mg-kwb-opp-defender",
  name: "Opponent Defender",
  cost: 3,
  strength: 5,
  willpower: 10,
  lore: 1,
});

describe("Mother Gothel - Knows What's Best", () => {
  describe("LOOK WHAT YOU'VE DONE - When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and return-to-hand-when-banished this turn", () => {
    it("triggers as optional bag effect when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [motherGothelKnowsWhatsBest],
        inkwell: motherGothelKnowsWhatsBest.cost,
        play: [ally],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(motherGothelKnowsWhatsBest)).toBeSuccessfulCommand();

      // Should have a bag effect for the optional triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("deals 2 damage to chosen ally and grants Challenger +1 and return-to-hand-when-banished this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelKnowsWhatsBest],
          inkwell: motherGothelKnowsWhatsBest.cost,
          play: [ally],
          deck: 2,
        },
        {
          play: [{ card: opponentDefender, exerted: true }],
          deck: 2,
        },
      );

      const allyInstanceId = testEngine.findCardInstanceId(ally, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(motherGothelKnowsWhatsBest)).toBeSuccessfulCommand();

      // Accept the optional and target the ally
      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelKnowsWhatsBest, {
          resolveOptional: true,
          targets: [allyInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Ally should have 2 damage
      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(2);

      // Ally should have Challenger +1
      expect(testEngine.asPlayerOne().getKeywordValue(ally, "Challenger")).toBe(1);

      // Ally should have return-to-hand-when-banished
      expect(testEngine.hasGrantedAbility(ally, "return-to-hand-when-banished")).toBe(true);

      // Challenge with the ally - ally strength 2 + Challenger 1 = 3 damage to defender
      expect(testEngine.asPlayerOne().challenge(ally, opponentDefender)).toBeSuccessfulCommand();

      // Ally takes 5 damage from defender (strength 5) - ally has 5 willpower but already 2 damage = banished
      // But return-to-hand-when-banished should return it to hand
      expect(testEngine.asPlayerOne().getCardZone(ally)).toBe("hand");

      // Defender should have 3 damage (ally strength 2 + Challenger +1)
      expect(testEngine.asPlayerOne().getDamage(opponentDefender)).toBe(3);
    });

    it("deals 2 damage minus Resist to ally with Resist +1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [motherGothelKnowsWhatsBest],
        inkwell: motherGothelKnowsWhatsBest.cost,
        play: [allyWithResist],
        deck: 2,
      });

      const allyInstanceId = testEngine.findCardInstanceId(allyWithResist, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(motherGothelKnowsWhatsBest)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelKnowsWhatsBest, {
          resolveOptional: true,
          targets: [allyInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Ally with Resist +1 should take only 1 damage (2 - 1)
      expect(testEngine.asPlayerOne().getDamage(allyWithResist)).toBe(1);
    });

    it("does not deal damage or grant abilities when optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [motherGothelKnowsWhatsBest],
        inkwell: motherGothelKnowsWhatsBest.cost,
        play: [ally],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(motherGothelKnowsWhatsBest)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelKnowsWhatsBest, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Ally should have 0 damage
      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(0);

      // Ally should not have Challenger
      expect(testEngine.asPlayerOne().hasKeyword(ally, "Challenger")).toBe(false);
    });

    it("regression: only grants Challenger +1 and return-to-hand to the CHOSEN character, not all characters", () => {
      const secondAlly = createMockCharacter({
        id: "mg-kwb-second-ally",
        name: "Second Ally",
        cost: 3,
        strength: 2,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [motherGothelKnowsWhatsBest],
        inkwell: motherGothelKnowsWhatsBest.cost,
        play: [ally, secondAlly],
        deck: 2,
      });

      const allyInstanceId = testEngine.findCardInstanceId(ally, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(motherGothelKnowsWhatsBest)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelKnowsWhatsBest, {
          resolveOptional: true,
          targets: [allyInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Chosen ally should have the effects
      expect(testEngine.asPlayerOne().getDamage(ally)).toBe(2);
      expect(testEngine.asPlayerOne().getKeywordValue(ally, "Challenger")).toBe(1);

      // Second ally should NOT have Challenger +1 or damage
      expect(testEngine.asPlayerOne().getDamage(secondAlly)).toBe(0);
      expect(testEngine.asPlayerOne().hasKeyword(secondAlly, "Challenger")).toBe(false);
    });

    it("Challenger +1 and return-to-hand expire at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [motherGothelKnowsWhatsBest],
          inkwell: motherGothelKnowsWhatsBest.cost,
          play: [ally],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const allyInstanceId = testEngine.findCardInstanceId(ally, "play", PLAYER_ONE);

      expect(testEngine.asPlayerOne().playCard(motherGothelKnowsWhatsBest)).toBeSuccessfulCommand();

      const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(motherGothelKnowsWhatsBest, {
          resolveOptional: true,
          targets: [allyInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Verify abilities are granted
      expect(testEngine.asPlayerOne().getKeywordValue(ally, "Challenger")).toBe(1);
      expect(testEngine.hasGrantedAbility(ally, "return-to-hand-when-banished")).toBe(true);

      // Pass both turns
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      // Challenger and return-to-hand should have expired
      expect(testEngine.asPlayerOne().hasKeyword(ally, "Challenger")).toBe(false);
      expect(testEngine.hasGrantedAbility(ally, "return-to-hand-when-banished")).toBe(false);
    });
  });
});
