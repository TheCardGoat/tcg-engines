// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/05-cards-and-card-types.md

import { describe, expect, it } from "bun:test";
import type { LocationCard } from "@tcg/lorcana-types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { arielOnHumanLegs, simbaProtectiveCub, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { deVilManorCruellasEstate, prideLandsPrideRock } from "@tcg/lorcana-cards/cards/003";
import { motunuiIslandParadise } from "@tcg/lorcana-cards/cards/009";

const playedThisTurnAbilityLocation: LocationCard = {
  id: "section-05-06-played-this-turn-ability-location",
  canonicalId: "ci_section-05-06-played-this-turn-ability-location",
  cardType: "location",
  name: "Training Yard",
  version: "Open Field",
  inkType: ["amber"],
  franchise: "Test",
  set: "TST",
  cardNumber: 506,
  rarity: "common",
  cost: 1,
  moveCost: 1,
  willpower: 5,
  lore: 0,
  inkable: true,
  i18n: {
    en: {
      name: "Training Yard",
      version: "Open Field",
      text: [
        {
          title: "OPEN FOR BUSINESS",
          description: "{E} - Gain 1 lore.",
        },
      ],
    },
    de: {
      name: "Training Yard",
      version: "Open Field",
      text: [
        {
          title: "OPEN FOR BUSINESS",
          description: "{E} - Gain 1 lore.",
        },
      ],
    },
    fr: {
      name: "Training Yard",
      version: "Open Field",
      text: [
        {
          title: "OPEN FOR BUSINESS",
          description: "{E} - Gain 1 lore.",
        },
      ],
    },
    it: {
      name: "Training Yard",
      version: "Open Field",
      text: [
        {
          title: "OPEN FOR BUSINESS",
          description: "{E} - Gain 1 lore.",
        },
      ],
    },
  },
  text: [
    {
      title: "OPEN FOR BUSINESS",
      description: "{E} - Gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "section-05-06-open-for-business",
      name: "OPEN FOR BUSINESS",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "OPEN FOR BUSINESS {E} - Gain 1 lore.",
    },
  ],
};

const locationDamageAttacker = createMockCharacter({
  id: "section-05-06-location-damage-attacker",
  name: "Location Damage Attacker",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("#### 5. CARDS AND CARD TYPES", () => {
  // 5.6. Locations
  // 5.6.1. Locations are a type of card that can be in play. A location is a location while in the Play zone; in all other zones it's a location card.
  // 5.6.2. Locations are generally played during a player's Main Phase (see 3.3).
  // 5.6.3. A location is defined as having "Location" on the classification line. Locations are the only card type printed in landscape (i.e., with the longer sides on the top and bottom).
  // 5.6.4. If a location has an ability, that ability can be used during the turn the location is played.
  // 5.6.5. Locations have additional parts on their cards.
  //
  // 5.6.5.1. Move Cost - The amount of ink needed to move a character to this location.
  // 5.6.5.2. Willpower - Damage on a location is persistent, which means it accumulates over the course of the game. If a location has damage equal to or higher than its \(\clubsuit\) , it's banished as the result of a game state check. Locations don't have a \(\text{品}\) characteristic and don't deal damage.
  // 5.6.5.3. Lore Value - How much lore its player gains at the start of their turn during the Set step.

  describe("# 5.6. Locations", () => {
    it("5.6.2. Locations are generally played during a player's Main Phase.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [deVilManorCruellasEstate],
        inkwell: deVilManorCruellasEstate.cost,
      });

      expect(testEngine.getCurrentPhase()).toBe("main");
      expect(testEngine.asPlayerOne().getCardZone(deVilManorCruellasEstate)).toBe("hand");

      expect(testEngine.asPlayerOne().playCard(deVilManorCruellasEstate)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(deVilManorCruellasEstate)).toBe("play");
    });

    it("5.6.4. If a location has an ability, that ability can be used during the turn the location is played.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [playedThisTurnAbilityLocation],
        inkwell: playedThisTurnAbilityLocation.cost,
      });

      expect(
        testEngine.asPlayerOne().playCard(playedThisTurnAbilityLocation),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(
        testEngine.asPlayerOne().activateAbility(playedThisTurnAbilityLocation, "OPEN FOR BUSINESS")
          .success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().isExerted(playedThisTurnAbilityLocation)).toBe(true);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("5.6.5.1. Move Cost is the amount of ink needed to move a character to this location.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [arielOnHumanLegs, prideLandsPrideRock],
        inkwell: [simbaProtectiveCub, stitchNewDog],
      });
      const firstInkId = testEngine.findCardInstanceId(simbaProtectiveCub, "inkwell", "p1");
      const secondInkId = testEngine.findCardInstanceId(stitchNewDog, "inkwell", "p1");

      expect(
        testEngine.asPlayerOne().moveCharacterToLocation(arielOnHumanLegs, prideLandsPrideRock)
          .success,
      ).toBe(true);

      expect(testEngine.asServer().getCard(firstInkId)?.exerted).toBe(true);
      expect(testEngine.asServer().getCard(secondInkId)?.exerted).toBe(true);
    });

    it("5.6.5.2. Damage on a location is persistent, and lethal damage banishes it as a game state check.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: locationDamageAttacker, isDrying: false }],
          deck: 2,
        },
        {
          play: [deVilManorCruellasEstate],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(locationDamageAttacker, deVilManorCruellasEstate)
          .success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(deVilManorCruellasEstate)).toBe(
        locationDamageAttacker.strength,
      );
      expect(testEngine.asPlayerOne().getCardZone(deVilManorCruellasEstate)).toBe("play");

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(deVilManorCruellasEstate)).toBe(
        locationDamageAttacker.strength,
      );
      expect(testEngine.asPlayerOne().getCardZone(deVilManorCruellasEstate)).toBe("play");

      expect(
        testEngine.asPlayerOne().challenge(locationDamageAttacker, deVilManorCruellasEstate)
          .success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(deVilManorCruellasEstate)).toBe("discard");
    });

    it("5.6.5.3. Lore Value is how much lore its player gains at the start of their turn during the Set step.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [motunuiIslandParadise],
      });

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(motunuiIslandParadise.lore);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
