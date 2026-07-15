// .agents/skills/lorcana-rules/SKILL.md
// .agents/skills/lorcana-rules/indexes/by-section/05-cards-and-card-types.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  arielSpectacularSinger,
  fireTheCannons,
  friendsOnTheOtherSide,
  moanaChosenByTheOcean,
  stitchNewDog,
  tinkerBellPeterPansAlly,
} from "@tcg/lorcana-cards/cards/001";
import { tiggerOneOfAKind } from "@tcg/lorcana-cards/cards/002";
import { i2i } from "@tcg/lorcana-cards/cards/009";
import { miloThatchCleverCartographer } from "@tcg/lorcana-cards/cards/003";

describe("#### 5. CARDS AND CARD TYPES", () => {
  //   # 5.4. Actions
  //
  //   5.4.1. Actions are a type of card that enters play briefly to generate an immediate effect. An action card that's in the Play zone is an action; in all other zones it's an action card.
  //
  //   5.4.1.1. An action is defined as having "Action" on the card's classification line.
  //   5.4.1.2. Actions are played from a player's hand. When an action is played, its effect resolves immediately. An action is put into the Play zone while the effect resolves. After the effect resolves, the action is put into the player's discard pile. An effect from an action doesn't enter the bag. (See 7.7, "Bag.")
  //
  //   5.4.2. Actions are generally played during a player's Main Phase (see 3.3).
  //   5.4.3. Effects - Actions have effects rather than abilities.
  //   5.4.4. Songs
  //
  //   5.4.4.1. Songs are a type of action that are defined as having both "Action" and "Song" on the classification line.
  //   5.4.4.2. Songs have a special rule in addition to the normal rules for actions (see 5.4.1 through 5.4.3). All songs allow the player to pay an alternate cost instead of their ink cost to play them. Being a song means "You may pay, 'a character with ink cost N or greater' to play this card instead of its ink cost," where N equals the ink cost of the song. This is called singing the song.
  //   5.4.4.3. Some songs also have the keyword Sing Together, which functions similarly to the special rule. (See 8.12, "Sing Together.")
  //
  //   5.4.5. Triggered abilities that occur from playing an action are added to the bag but won't resolve until after the action is played (see 4.3.4).
  describe("# 5.4. Actions", () => {
    it('5.4.1.1. An action is defined as having "Action" on the card\'s classification line.', () => {
      expect(fireTheCannons.cardType).toBe("action");
    });

    it("5.4.1.2. Actions are played from hand, resolve immediately, and then go to the discard pile.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [arielOnHumanLegs],
        },
      );

      expect(testEngine.getCurrentPhase()).toBe("main");
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("hand");

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [arielOnHumanLegs] }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it('5.4.4.1. Songs are actions that have both "Action" and "Song" on the classification line.', () => {
      expect(friendsOnTheOtherSide.cardType).toBe("action");
      expect(friendsOnTheOtherSide.actionSubtype).toBe("song");
    });

    it("5.4.4.2. Songs can be sung by exerting a character instead of paying their ink cost.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [friendsOnTheOtherSide],
        play: [{ card: arielSpectacularSinger, isDrying: false }],
        deck: [arielOnHumanLegs, miloThatchCleverCartographer],
      });

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(0);

      expect(
        testEngine.asPlayerOne().singSong(friendsOnTheOtherSide, arielSpectacularSinger).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().isExerted(arielSpectacularSinger)).toBe(true);
      expect(testEngine.asPlayerOne().getCardZone(friendsOnTheOtherSide)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(0);
    });

    it("5.4.4.3. Songs with Sing Together can be played using multiple singers.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [i2i],
        play: [
          { card: moanaChosenByTheOcean, isDrying: false },
          { card: tinkerBellPeterPansAlly, isDrying: false },
        ],
        deck: [fireTheCannons, stitchNewDog],
      });

      expect(
        testEngine
          .asPlayerOne()
          .playSongTogether(i2i, [moanaChosenByTheOcean, tinkerBellPeterPansAlly]).success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().getCardZone(i2i)).toBe("discard");
      expect(testEngine.asPlayerOne().isExerted(moanaChosenByTheOcean)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(tinkerBellPeterPansAlly)).toBe(false);
    });

    it("5.4.5. Triggered abilities that occur from playing an action are added to the bag and resolve only after the action is played.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [tiggerOneOfAKind],
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [arielOnHumanLegs],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [arielOnHumanLegs] }).success,
      ).toBe(true);

      expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toBe(2);
      expect(testEngine.asPlayerOne().getCardZone(fireTheCannons)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardStrength(tiggerOneOfAKind)).toBe(
        tiggerOneOfAKind.strength + 2,
      );
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
