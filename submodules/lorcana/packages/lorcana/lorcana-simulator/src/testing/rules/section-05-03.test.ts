// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/05-cards-and-card-types.md

import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  controlYourTemper,
  dinglehopper,
  fireTheCannons,
  minnieMouseAlwaysClassy,
  stitchNewDog,
  theQueenWickedAndVain,
} from "@tcg/lorcana-cards/cards/001";
import { miloThatchCleverCartographer } from "@tcg/lorcana-cards/cards/003";

describe("#### 5. CARDS AND CARD TYPES", () => {
  // # 5.3. Characters
  //
  //   5.3.1. Characters are a type of card that can be in play. A character card that's in the Play zone is a character; in all other zones it's a character card.
  //   5.3.2. Characters are generally played during a player's Main Phase (see 3.3).
  //   5.3.3. Characters don't list "Character" on their classification line. A card needs to have both characteristics outlined in 5.3.3.1 and 5.3.3.2 to be a character. If not, the card isn't a character.
  //
  //   5.3.3.1. A character has a value and a value.
  //   5.3.3.2. A character has at least one of the following listed on the classification line: Alien, Ally, Broom, Captain, Colossus, Deity, Detective, Dinosaur, Dragon, Dreamborn, Entangled, Fairy, Floodborn, Gargoyle, Ghost, Giant, Hero, Hunny, Hyena, Illusion, Inventor, King, Knight, Madrigal, Mentor, Musketeer, Pirate, Prince, Princess, Puppy, Queen, Racer, Robot, Seven Dwarfs, Sorcerer, Storyborn, Super, Tigger, Titan, Villain, Whisper.
  //
  //   5.3.4. Only characters can quest or challenge.
  //   5.3.5. A character must have been in play at the beginning of the Set step of their player's turn in order to quest, challenge, or as part of a cost (see 3.2.2, "Set").
  //   5.3.6. Characters have additional parts on their cards.
  //
  //   5.3.6.1. Version - A card's version differentiates cards with the same name. A card's version name applies in all zones. A character's name and version together constitute its full name.
  //   5.3.6.2. Strength - Primarily, how much damage this character deals in a challenge, though card effects can also reference this value. If a character would deal damage equal to its \(\mathbb{Q}\) and it has 0 or less \(\mathbb{Q}\) , it deals no damage.
  //   5.3.6.3. Willpower - Damage on a character is persistent, which means it accumulates over the course of the game. If a character has damage equal to or higher than their \(\clubsuit\) , they're banished as a result of a game state check. Card effects can also reference this value.
  //   5.3.6.4. Lore Value - How much lore their player gains when the character quests.
  describe("# 5.3. Characters", () => {
    it("5.3.2. Characters are generally played during a player's Main Phase.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [minnieMouseAlwaysClassy],
        inkwell: minnieMouseAlwaysClassy.cost,
      });

      expect(testEngine.getCurrentPhase()).toBe("main");
      expect(testEngine.asPlayerOne().getCardZone(minnieMouseAlwaysClassy)).toBe("hand");

      expect(testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(minnieMouseAlwaysClassy)).toBe("play");
    });

    it("5.3.3. Characters are identified by their strength, willpower, lore, version, and classification line.", () => {
      expect(arielOnHumanLegs.cardType).toBe("character");
      expect(arielOnHumanLegs.version).toBe("On Human Legs");
      expect(arielOnHumanLegs.strength).toBeGreaterThan(0);
      expect(arielOnHumanLegs.willpower).toBeGreaterThan(0);
      expect(arielOnHumanLegs.lore).toBeGreaterThan(0);
      expect(arielOnHumanLegs.classifications).toContain("Princess");
    });

    it("5.3.4. Only characters can quest or challenge.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [dinglehopper],
        },
        {
          play: [{ card: miloThatchCleverCartographer, exerted: true }],
        },
      );

      const questResult = testEngine.asPlayerOne().quest(dinglehopper) as CommandFailure;
      expect(questResult.success).toBe(false);
      expect(questResult.errorCode).toBe("NOT_A_CHARACTER");

      const challengeResult = testEngine
        .asPlayerOne()
        .challenge(dinglehopper, miloThatchCleverCartographer) as CommandFailure;
      expect(challengeResult.success).toBe(false);
      expect(challengeResult.errorCode).toBe("ATTACKER_NOT_CHARACTER");
    });

    it("5.3.5. A character must have been in play at the beginning of the Set step to quest, challenge, or {E} as part of a cost.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [minnieMouseAlwaysClassy, theQueenWickedAndVain],
          inkwell: minnieMouseAlwaysClassy.cost + theQueenWickedAndVain.cost,
        },
        {
          play: [{ card: miloThatchCleverCartographer, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().playCard(minnieMouseAlwaysClassy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(theQueenWickedAndVain)).toBeSuccessfulCommand();

      const questResult = testEngine.asPlayerOne().quest(minnieMouseAlwaysClassy) as CommandFailure;
      expect(questResult.success).toBe(false);
      expect(questResult.errorCode).toBe("CARD_DRYING");

      const challengeResult = testEngine
        .asPlayerOne()
        .challenge(minnieMouseAlwaysClassy, miloThatchCleverCartographer) as CommandFailure;
      expect(challengeResult.success).toBe(false);
      expect(challengeResult.errorCode).toBe("ATTACKER_DRYING");

      const activateAbilityResult = testEngine
        .asPlayerOne()
        .activateAbility(theQueenWickedAndVain, "I SUMMON THEE") as CommandFailure;
      expect(activateAbilityResult.success).toBe(false);
      expect(activateAbilityResult.errorCode).toBe("CARD_DRYING");
    });

    it("5.3.6.2. If a character would deal damage equal to its strength and it has 0 or less strength, it deals no damage.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [controlYourTemper],
          inkwell: controlYourTemper.cost,
          play: [{ card: stitchNewDog, isDrying: false }],
        },
        {
          play: [{ card: miloThatchCleverCartographer, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(controlYourTemper, { targets: [stitchNewDog] }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getCardStrength(stitchNewDog)).toBe(0);

      expect(
        testEngine.asPlayerOne().challenge(stitchNewDog, miloThatchCleverCartographer).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getDamage(miloThatchCleverCartographer)).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(miloThatchCleverCartographer)).toBe("play");
    });

    it("5.3.6.3. Damage on a character is persistent, and lethal damage banishes it as a game state check.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [arielOnHumanLegs],
        },
        {
          hand: [fireTheCannons, fireTheCannons],
          inkwell: fireTheCannons.cost * 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(fireTheCannons, { targets: [arielOnHumanLegs] }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("play");

      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("play");

      expect(
        testEngine.asPlayerTwo().playCard(fireTheCannons, { targets: [arielOnHumanLegs] }).success,
      ).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(arielOnHumanLegs)).toBe("discard");
    });

    it("5.3.6.4. Lore Value is how much lore their player gains when the character quests.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [stitchNewDog],
      });

      expect(testEngine.asPlayerOne().quest(stitchNewDog)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(stitchNewDog.lore);
    });
  });
});
