// .agents/skills/lorcana-rules/SKILL.md
// .claude/skills/lorcana-rules/indexes/by-section/08-keywords.md

import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { eeyoreOverstuffedDonkey } from "@tcg/lorcana-cards/cards/009";
import {
  arielOnHumanLegs,
  fireTheCannons,
  mickeyMouseTrueFriend,
  plasmaBlaster,
} from "@tcg/lorcana-cards/cards/001";
import { beastRelentless, mouseArmor } from "@tcg/lorcana-cards/cards/002";
import { mosquitoBite } from "@tcg/lorcana-cards/cards/006";
import { bestowAGift } from "@tcg/lorcana-cards/cards/003";

describe("#### 8. KEYWORDS", () => {
  describe("# 8.8. Resist", () => {
    it('8.8.1. The Resist keyword represents a static ability that modifies the amount of damage dealt to the card with the keyword. Resist +N means "Damage that would be dealt to this character or location is reduced by N." Resist is a damage reduction (see 4.6.6.1).', () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseTrueFriend],
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
        },
        {
          play: [{ card: eeyoreOverstuffedDonkey, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [eeyoreOverstuffedDonkey] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, eeyoreOverstuffedDonkey),
      ).toBeSuccessfulCommand();

      // Mickey only causes 2 damage, and he has 3 Strength and Donkey has Resist +1
      expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(3);
    });

    it("8.8.1. Because this is a +N ability, this stacks with other Resist effects.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [fireTheCannons],
          inkwell: fireTheCannons.cost,
          play: [mouseArmor],
        },
        {
          play: [eeyoreOverstuffedDonkey],
        },
      );

      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(mouseArmor, { targets: [eeyoreOverstuffedDonkey] }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().playCard(fireTheCannons, { targets: [eeyoreOverstuffedDonkey] }),
      ).toBeSuccessfulCommand();

      // Eeyore has Resist +1 and gained Resist +1 from Mouse Armor
      expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(0);
      expect(testEngine.asPlayerTwo().getCardZone(eeyoreOverstuffedDonkey)).toBe("play");
    });

    it("8.8.2. If damage dealt to this character or location is reduced to 0, no damage is considered to have been dealt.", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 2,
          play: [plasmaBlaster, { card: beastRelentless, exerted: true }],
        },
        {
          play: [eeyoreOverstuffedDonkey],
        },
      );

      expect(
        testEngine
          .asPlayerOne()
          .activateAbility(plasmaBlaster, { targets: [eeyoreOverstuffedDonkey] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(0);
      // Damage was reduced to 0, Beast's ability should NOT trigger
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    describe("8.8.3. Damage put or moved onto a character with Resist isn't affected by the ability.", () => {
      it("Put Damage ignores resist", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [mosquitoBite],
            inkwell: mosquitoBite.cost,
          },
          {
            play: [eeyoreOverstuffedDonkey],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(mosquitoBite, { targets: [eeyoreOverstuffedDonkey] }),
        ).toBeSuccessfulCommand();

        // Put damage should not be reduced.
        expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);
      });

      it("Move damage ignores resist", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [bestowAGift],
            inkwell: bestowAGift.cost,
            play: [arielOnHumanLegs],
          },
          {
            play: [eeyoreOverstuffedDonkey],
          },
        );

        testEngine.asServer().manualSetDamage(arielOnHumanLegs, 2);
        expect(
          testEngine.asPlayerOne().playCard(bestowAGift, {
            targets: [arielOnHumanLegs, eeyoreOverstuffedDonkey],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asServer().getDamage(arielOnHumanLegs)).toBe(1);
        expect(testEngine.asPlayerTwo().getDamage(eeyoreOverstuffedDonkey)).toBe(1);
      });
    });
  });
});
