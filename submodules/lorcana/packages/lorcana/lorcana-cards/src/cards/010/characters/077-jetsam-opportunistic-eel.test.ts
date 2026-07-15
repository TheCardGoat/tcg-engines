import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jetsamOpportunisticEel } from "./077-jetsam-opportunistic-eel";

const tankCharacter = createMockCharacter({
  id: "jetsam-test-tank",
  name: "Tank",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
});

const fragileCharacter = createMockCharacter({
  id: "jetsam-test-fragile",
  name: "Fragile",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Jetsam - Opportunistic Eel", () => {
  describe("AMBUSH FROM THE DEEP - Basic Functionality", () => {
    it("deals 3 damage to chosen opposing damaged character when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          play: [tankCharacter],
          deck: 2,
        },
      );

      // Pre-damage the target to make it a valid target
      expect(testEngine.asServer().manualSetDamage(tankCharacter, 1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(1);

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      const targetId = testEngine.findCardInstanceId(tankCharacter, "play", "player_two");
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jetsamOpportunisticEel, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Should have dealt 3 additional damage (1 pre-damage + 3 from ability = 4)
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(4);
      expect(testEngine.asPlayerTwo().getCardZone(tankCharacter)).toBe("play");
    });

    it("deals 3 damage to damaged character without banishing if it survives", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          play: [tankCharacter],
          deck: 2,
        },
      );

      // 2 pre-damage + 3 from ability = 5 on a 6-willpower character
      expect(testEngine.asServer().manualSetDamage(tankCharacter, 2)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(2);

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      const targetId = testEngine.findCardInstanceId(tankCharacter, "play", "player_two");
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jetsamOpportunisticEel, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Should have dealt 3 additional damage (2 + 3 = 5, survives with 6 willpower)
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(5);
      expect(testEngine.asPlayerTwo().getCardZone(tankCharacter)).toBe("play");
    });
  });

  describe("AMBUSH FROM THE DEEP - Targeting Restrictions", () => {
    it("cannot target undamaged characters — no bag effect is created", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          play: [tankCharacter], // undamaged
          deck: 2,
        },
      );

      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(0);

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      // No valid targets => ability should not put anything in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(0);
    });

    it("can only target opposing characters, not own damaged characters", () => {
      const ownCharacter = createMockCharacter({
        id: "jetsam-test-own",
        name: "Own Character",
        cost: 2,
        strength: 2,
        willpower: 4,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          play: [ownCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Damage own character
      expect(testEngine.asServer().manualSetDamage(ownCharacter, 1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(1);

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      // Own damaged characters are not valid targets — no bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getDamage(ownCharacter)).toBe(1);
    });
  });

  describe("AMBUSH FROM THE DEEP - Multiple Valid Targets", () => {
    it("allows player to choose which damaged opposing character to damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          play: [tankCharacter, fragileCharacter],
          deck: 2,
        },
      );

      // Damage both opposing characters
      expect(testEngine.asServer().manualSetDamage(tankCharacter, 1)).toBeSuccessfulCommand();
      expect(testEngine.asServer().manualSetDamage(fragileCharacter, 1)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      // Choose tank character (6 willpower, won't die)
      const tankId = testEngine.findCardInstanceId(tankCharacter, "play", "player_two");
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jetsamOpportunisticEel, { targets: [tankId] }),
      ).toBeSuccessfulCommand();

      // Only the chosen target should take additional damage
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(4);
      // fragile only has 1 pre-existing damage
      expect(testEngine.asPlayerTwo().getDamage(fragileCharacter)).toBe(1);
    });
  });

  describe("AMBUSH FROM THE DEEP - Edge Cases", () => {
    it("works when opponent has no valid targets — Jetsam still enters play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      // No valid targets, no bag effect
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(jetsamOpportunisticEel)).toBe("play");
    });

    it("can banish character if damage exceeds willpower", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          play: [fragileCharacter], // 3 willpower
          deck: 2,
        },
      );

      // Pre-damage to 1 on a 3-willpower character; 1 + 3 = 4 damage => banished (exceeds 3 willpower)
      expect(testEngine.asServer().manualSetDamage(fragileCharacter, 1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(fragileCharacter)).toBe(1);

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      const targetId = testEngine.findCardInstanceId(fragileCharacter, "play", "player_two");
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jetsamOpportunisticEel, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Should be banished (1 + 3 = 4 damage on 3 willpower)
      expect(testEngine.asPlayerTwo().getCardZone(fragileCharacter)).toBe("discard");
    });

    it("triggers only when Jetsam is played, not when already in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          play: [tankCharacter],
          deck: 2,
        },
      );

      // Damage target after Jetsam is already in play via manualSetDamage
      expect(testEngine.asServer().manualSetDamage(tankCharacter, 2)).toBeSuccessfulCommand();

      // No bag effect since Jetsam wasn't played this turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(2);
    });
  });

  describe("AMBUSH FROM THE DEEP - Damage Calculation", () => {
    it("deals exactly 3 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jetsamOpportunisticEel.cost,
          hand: [jetsamOpportunisticEel],
          deck: 2,
        },
        {
          play: [tankCharacter], // 6 willpower
          deck: 2,
        },
      );

      expect(testEngine.asServer().manualSetDamage(tankCharacter, 1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(1);

      expect(testEngine.asPlayerOne().playCard(jetsamOpportunisticEel)).toBeSuccessfulCommand();

      const targetId = testEngine.findCardInstanceId(tankCharacter, "play", "player_two");
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jetsamOpportunisticEel, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Should have exactly 4 total damage (1 + 3)
      expect(testEngine.asPlayerTwo().getDamage(tankCharacter)).toBe(4);
    });
  });
});
