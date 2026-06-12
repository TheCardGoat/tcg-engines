import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rapunzelReadyForAdventure } from "./003-rapunzel-ready-for-adventure";

const moana = createMockCharacter({
  id: "rapunzel-test-moana",
  name: "Moana",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
});

const heihei = createMockCharacter({
  id: "rapunzel-test-heihei",
  name: "Heihei",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const stitch = createMockCharacter({
  id: "rapunzel-test-stitch",
  name: "Stitch",
  cost: 7,
  strength: 6,
  willpower: 5,
  lore: 2,
});

// A second attacker that can challenge moana without banishing her (strength 3 < moana's willpower 5)
const pegasus = createMockCharacter({
  id: "rapunzel-test-pegasus",
  name: "Pegasus",
  cost: 4,
  strength: 3,
  willpower: 6,
  lore: 1,
});

const pascal = createMockCharacter({
  id: "rapunzel-test-pascal",
  name: "Pascal",
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
});

describe("Rapunzel - Ready for Adventure", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rapunzelReadyForAdventure],
    });

    const cardUnderTest = testEngine.getCardModel(rapunzelReadyForAdventure);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });

  describe("ACT OF KINDNESS - Whenever one of your characters is chosen for Support, until start of your next turn, the next time they would be dealt damage they take no damage instead.", () => {
    it("chosen character takes no damage from the next challenge after being supported", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelReadyForAdventure, moana],
          deck: 5,
        },
        {
          play: [stitch],
          deck: 5,
        },
      );

      // Quest Rapunzel on player one's turn - Support fires
      expect(testEngine.asPlayerOne().quest(rapunzelReadyForAdventure)).toBeSuccessfulCommand();

      // Resolve the Support bag effect targeting Moana
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bagEffect of bagEffects) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(rapunzelReadyForAdventure, {
            resolveOptional: true,
            targets: [moana],
          }),
        ).toBeSuccessfulCommand();
      }

      // Exert Moana so she can be challenged
      expect(testEngine.asServer().manualExertCard(moana)).toBeSuccessfulCommand();

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two challenges Moana with Stitch - ACT OF KINDNESS protection should prevent damage
      expect(testEngine.asPlayerTwo().challenge(stitch, moana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(moana)).toBe(0);
    });

    it("protection is consumed after preventing the first real damage (not from 0-strength attack)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelReadyForAdventure, moana],
          deck: 5,
        },
        {
          play: [heihei, pegasus],
          deck: 5,
        },
      );

      // Quest Rapunzel to give Moana protection
      expect(testEngine.asPlayerOne().quest(rapunzelReadyForAdventure)).toBeSuccessfulCommand();
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bagEffect of bagEffects) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(rapunzelReadyForAdventure, {
            resolveOptional: true,
            targets: [moana],
          }),
        ).toBeSuccessfulCommand();
      }

      // Exert Moana so she can be challenged
      expect(testEngine.asServer().manualExertCard(moana)).toBeSuccessfulCommand();

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // First challenge: Heihei (1 str) vs Moana - ACT OF KINDNESS protection prevents damage
      expect(testEngine.asPlayerTwo().challenge(heihei, moana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(moana)).toBe(0);

      // Protection is now consumed. Second challenge: Pegasus (3 str) vs Moana
      // Moana is still exerted from the manual exert before, so she can be challenged again
      // Pegasus strength (3) < Moana willpower (5), so Moana is NOT banished
      expect(testEngine.asPlayerTwo().challenge(pegasus, moana)).toBeSuccessfulCommand();

      // Protection was consumed after first hit, so Moana takes full damage from Pegasus
      expect(testEngine.asPlayerOne().getDamage(moana)).toBe(pegasus.strength);
    });

    it("regression: later attackers in the same turn deal damage after the shield is consumed", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelReadyForAdventure, moana],
          deck: 5,
        },
        {
          play: [heihei, pegasus, pascal],
          deck: 5,
        },
      );

      expect(testEngine.asPlayerOne().quest(rapunzelReadyForAdventure)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelReadyForAdventure, {
          resolveOptional: true,
          targets: [moana],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asServer().manualExertCard(moana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().challenge(heihei, moana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(moana)).toBe(0);

      const secondChallengePreview = testEngine.asPlayerTwo().previewChallenge(pegasus, moana);
      expect(secondChallengePreview).toMatchObject({
        attackerDamageDealt: pegasus.strength,
        defenderDamageIsReduced: false,
      });
      expect(testEngine.asPlayerTwo().challenge(pegasus, moana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(moana)).toBe(pegasus.strength);

      const thirdChallengePreview = testEngine.asPlayerTwo().previewChallenge(pascal, moana);
      expect(thirdChallengePreview).toMatchObject({
        attackerDamageDealt: pascal.strength,
        defenderCurrentDamage: pegasus.strength,
        defenderDamageIsReduced: false,
      });
      expect(testEngine.asPlayerTwo().challenge(pascal, moana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(moana)).toBe(pegasus.strength + pascal.strength);
    });

    it("protection does NOT apply on player one's next turn (expires)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelReadyForAdventure, moana],
          deck: 5,
        },
        {
          play: [pegasus],
          deck: 5,
        },
      );

      // Quest Rapunzel to give Moana protection
      expect(testEngine.asPlayerOne().quest(rapunzelReadyForAdventure)).toBeSuccessfulCommand();
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      for (const bagEffect of bagEffects) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(rapunzelReadyForAdventure, {
            resolveOptional: true,
            targets: [moana],
          }),
        ).toBeSuccessfulCommand();
      }

      // Exert Moana so she can be challenged
      expect(testEngine.asServer().manualExertCard(moana)).toBeSuccessfulCommand();

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two doesn't attack (protection is still active)
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Now it's player one's turn again - protection should have expired
      // Exert Moana so she can be challenged again
      expect(testEngine.asServer().manualExertCard(moana)).toBeSuccessfulCommand();

      // Pass turn to player two again
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Pegasus (3 str) challenges Moana on player two's turn - protection expired, takes full damage
      // Pegasus strength (3) < Moana willpower (5), so Moana is NOT banished
      expect(testEngine.asPlayerTwo().challenge(pegasus, moana)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(moana)).toBe(pegasus.strength);
    });

    it("does NOT trigger when opponent supports their character", () => {
      // Player one has Rapunzel (ACT OF KINDNESS) and pegasus as attacker
      // Player two has heihei (support) and moana as the support target
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [rapunzelReadyForAdventure, pegasus],
          deck: 5,
        },
        {
          play: [heihei, moana],
          deck: 5,
        },
      );

      // Pass to player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two quests Heihei (with support) targeting Moana
      // This fires a "support" event for player TWO's characters, not player ONE's
      expect(testEngine.asPlayerTwo().quest(heihei)).toBeSuccessfulCommand();
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      for (const bagEffect of bagEffects) {
        testEngine.asPlayerTwo().resolvePendingByCard(rapunzelReadyForAdventure, {
          resolveOptional: true,
          targets: [moana],
        });
      }

      // Exert Moana so she can be challenged
      expect(testEngine.asServer().manualExertCard(moana)).toBeSuccessfulCommand();

      // Pass turn back to player one
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Player one challenges Moana with Pegasus - Rapunzel's ACT OF KINDNESS should NOT apply
      // because Moana is player two's character and was supported by player two's heihei,
      // not player one's characters
      // Pegasus strength (3) < Moana willpower (5), so Moana is NOT banished
      expect(testEngine.asPlayerOne().challenge(pegasus, moana)).toBeSuccessfulCommand();

      // Moana should take full damage - Rapunzel's ability only protects OUR characters when chosen for support
      expect(testEngine.asPlayerTwo().getDamage(moana)).toBe(pegasus.strength);
    });
  });
});

describe("regression: ACT OF KINDNESS prevents Support damage on opponent's turn", () => {
  it("prevents challenge damage on opponent's turn after being supported on own turn", () => {
    const supportTarget = createMockCharacter({
      id: "rapunzel-rfa-support-target",
      name: "Support Target",
      cost: 3,
      strength: 3,
      willpower: 5,
      lore: 1,
    });

    const opponentAttacker = createMockCharacter({
      id: "rapunzel-rfa-opponent-attacker",
      name: "Opponent Attacker",
      cost: 4,
      strength: 4,
      willpower: 5,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [rapunzelReadyForAdventure, supportTarget],
        deck: 5,
      },
      {
        play: [opponentAttacker],
        deck: 5,
      },
    );

    // Quest Rapunzel on player one's turn - Support fires
    expect(testEngine.asPlayerOne().quest(rapunzelReadyForAdventure)).toBeSuccessfulCommand();

    // Resolve the Support bag effect targeting supportTarget
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    for (const bagEffect of bagEffects) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(rapunzelReadyForAdventure, {
          resolveOptional: true,
          targets: [supportTarget],
        }),
      ).toBeSuccessfulCommand();
    }

    // Exert supportTarget so it can be challenged
    expect(testEngine.asServer().manualExertCard(supportTarget)).toBeSuccessfulCommand();

    // Pass to opponent's turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent challenges - ACT OF KINDNESS should prevent the damage
    expect(
      testEngine.asPlayerTwo().challenge(opponentAttacker, supportTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(supportTarget)).toBe(0);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { heiheiBoatSnack } from "@lorcanito/lorcana-engine/cards/001/characters/007-heihei-boat-snack";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/014-moana-of-motunui";
// Import { seargentTibbies } from "@lorcanito/lorcana-engine/cards/001/characters/124-sergeant-tibbs-courageous-cat";
// Import { stitchAbomination } from "@lorcanito/lorcana-engine/cards/001/characters/125-stitch-abomination";
// Import { teKaTheBurningOne } from "@lorcanito/lorcana-engine/cards/001/characters/126-te-ka-the-burning-one";
// Import { johnSilverAlienPirate } from "@lorcanito/lorcana-engine/cards/001/characters/characters"; // pragma: allowlist secret
// Import { tianaCelebratingPrincess } from "@lorcanito/lorcana-engine/cards/002/characters/196-tiana-celebrating-princess";
// Import { herculesBelovedHero } from "@lorcanito/lorcana-engine/cards/004/characters/180-hercules-beloved-hero";
// Import { theQueenCruelestOfAll } from "@lorcanito/lorcana-engine/cards/005/characters/139-the-queen-cruelest-of-all";
// Import { tianaRestaurantOwner } from "@lorcanito/lorcana-engine/cards/006"; // pragma: allowlist secret
// Import { rapunzelReadyForAdventure } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// ... (rest of legacy tests)
