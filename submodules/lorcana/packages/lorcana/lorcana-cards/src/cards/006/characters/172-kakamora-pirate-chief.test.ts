import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { kakamoraPirateChief } from "./172-kakamora-pirate-chief";
import { kakamoraBoardingParty } from "./104-kakamora-boarding-party";

const nonPirateCharacter = createMockCharacter({
  id: "kakamora-chief-test-non-pirate",
  name: "Non Pirate Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  classifications: ["Storyborn", "Hero"],
});

const damageTarget = createMockCharacter({
  id: "kakamora-chief-test-damage-target",
  name: "Damage Target",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const mockLocation = createMockLocation({
  id: "kakamora-chief-test-location",
  name: "Mock Location",
  cost: 2,
});

describe("Kakamora - Pirate Chief", () => {
  describe("COCONUT LEADER - Whenever this character quests, you may draw a card. Then, choose and discard a card to deal 1 damage to chosen character or location. If a Pirate character card was discarded, deal 3 damage to that character or location instead.", () => {
    it("triggers an optional bag effect when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kakamoraPirateChief, isDrying: false }],
          hand: [nonPirateCharacter],
          deck: 2,
        },
        {
          play: [damageTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kakamoraPirateChief)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("deals 1 damage to chosen character when a non-pirate card is discarded", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kakamoraPirateChief, isDrying: false }],
          hand: [nonPirateCharacter],
          deck: 2,
        },
        {
          play: [damageTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kakamoraPirateChief)).toBeSuccessfulCommand();

      // Accept the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraPirateChief, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Discard the non-pirate character
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const discardEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const nonPirateInstanceId = testEngine.findCardInstanceId(
        nonPirateCharacter,
        "hand",
        "player_one",
      );
      expect(
        testEngine.asPlayerOne().resolveEffect(discardEffect.id, {
          targets: [nonPirateInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Now choose a damage target
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const selectTargetEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const damageTargetInstanceId = testEngine.findCardInstanceId(
        damageTarget,
        "play",
        "player_two",
      );
      expect(
        testEngine
          .asPlayerOne()
          .resolveEffect(selectTargetEffect.id, { targets: [damageTargetInstanceId] }),
      ).toBeSuccessfulCommand();

      // Non-pirate discard → 1 damage
      expect(testEngine.asPlayerTwo().getDamage(damageTarget)).toBe(1);
    });

    it("deals 3 damage to chosen character when a pirate card is discarded", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kakamoraPirateChief, isDrying: false }],
          hand: [kakamoraBoardingParty],
          deck: 2,
        },
        {
          play: [damageTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kakamoraPirateChief)).toBeSuccessfulCommand();

      // Accept the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraPirateChief, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Discard the pirate character
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const discardEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const pirateInstanceId = testEngine.findCardInstanceId(
        kakamoraBoardingParty,
        "hand",
        "player_one",
      );
      expect(
        testEngine.asPlayerOne().resolveEffect(discardEffect.id, {
          targets: [pirateInstanceId],
        }),
      ).toBeSuccessfulCommand();

      // Now choose a damage target
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const selectTargetEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const damageTargetInstanceId = testEngine.findCardInstanceId(
        damageTarget,
        "play",
        "player_two",
      );
      expect(
        testEngine
          .asPlayerOne()
          .resolveEffect(selectTargetEffect.id, { targets: [damageTargetInstanceId] }),
      ).toBeSuccessfulCommand();

      // Pirate discard → 3 damage
      expect(testEngine.asPlayerTwo().getDamage(damageTarget)).toBe(3);
    });

    it("deals 1 damage to chosen location when a non-pirate card is discarded", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kakamoraPirateChief, isDrying: false }, mockLocation],
          hand: [nonPirateCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kakamoraPirateChief)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraPirateChief, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const discardEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const nonPirateInstanceId = testEngine.findCardInstanceId(
        nonPirateCharacter,
        "hand",
        "player_one",
      );
      expect(
        testEngine.asPlayerOne().resolveEffect(discardEffect.id, {
          targets: [nonPirateInstanceId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const selectTargetEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const locationInstanceId = testEngine.findCardInstanceId(mockLocation, "play", "player_one");
      expect(
        testEngine
          .asPlayerOne()
          .resolveEffect(selectTargetEffect.id, { targets: [locationInstanceId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(mockLocation)).toBe(1);
    });

    it("deals 3 damage to chosen location when a pirate card is discarded", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kakamoraPirateChief, isDrying: false }, mockLocation],
          hand: [kakamoraBoardingParty],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kakamoraPirateChief)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraPirateChief, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const discardEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const pirateInstanceId = testEngine.findCardInstanceId(
        kakamoraBoardingParty,
        "hand",
        "player_one",
      );
      expect(
        testEngine.asPlayerOne().resolveEffect(discardEffect.id, {
          targets: [pirateInstanceId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const selectTargetEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const locationInstanceId = testEngine.findCardInstanceId(mockLocation, "play", "player_one");
      expect(
        testEngine
          .asPlayerOne()
          .resolveEffect(selectTargetEffect.id, { targets: [locationInstanceId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(mockLocation)).toBe(3);
    });

    // Regression: was only dealing 1 damage even when a Pirate character was discarded (fixed March 8)
    it("regression: deals 3 damage (not 1) to a location when a pirate character card is discarded", () => {
      const pirateCharacter = createMockCharacter({
        id: "kakamora-chief-test-pirate",
        name: "Pirate Test Character",
        cost: 2,
        strength: 2,
        willpower: 3,
        classifications: ["Storyborn", "Pirate"],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kakamoraPirateChief, isDrying: false }, mockLocation],
          hand: [pirateCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kakamoraPirateChief)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraPirateChief, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const discardEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const pirateInstanceId = testEngine.findCardInstanceId(pirateCharacter, "hand", "player_one");
      expect(
        testEngine.asPlayerOne().resolveEffect(discardEffect.id, {
          targets: [pirateInstanceId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
      const selectTargetEffect = testEngine.asPlayerOne().getPendingEffects()[0]!;

      const locationInstanceId = testEngine.findCardInstanceId(mockLocation, "play", "player_one");
      expect(
        testEngine
          .asPlayerOne()
          .resolveEffect(selectTargetEffect.id, { targets: [locationInstanceId] }),
      ).toBeSuccessfulCommand();

      // Pirate discard must deal 3 damage, not 1
      expect(testEngine.asPlayerOne().getDamage(mockLocation)).toBe(3);
    });

    it("does not trigger when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kakamoraPirateChief, isDrying: false }],
          hand: [nonPirateCharacter],
          deck: 2,
        },
        {
          play: [damageTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(kakamoraPirateChief)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kakamoraPirateChief, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(testEngine.asPlayerTwo().getDamage(damageTarget)).toBe(0);
    });
  });
});
