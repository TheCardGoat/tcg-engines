import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, elsaQueenRegent } from "../../001";
import { goofyKnightForADay } from "../../002";
import { morganaMacawberReformedSpellcaster } from "./047-morgana-macawber-reformed-spellcaster";
import { morganaMacawberSelfcenteredSpellcaster } from "./040-morgana-macawber-self-centered-spellcaster";

/**
 * Morgana Macawber - Reformed Spellcaster
 * Cost: 6, Strength: 6, Willpower: 6, Lore: 1
 * Classifications: Floodborn, Super, Hero, Sorcerer
 *
 * Shift 4 (You may pay 4 ink to play this on top of one of your characters named Morgana Macawber.)
 *
 * JUST FOR YOU - When you play this character, you may choose an opposing character
 * and move 1 damage from each other character to them.
 */
describe("Morgana Macawber - Reformed Spellcaster", () => {
  describe("Shift 4", () => {
    it("can be played using Shift 4 on Morgana Macawber - Self-Centered Spellcaster", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 4,
        play: [morganaMacawberSelfcenteredSpellcaster],
        hand: [morganaMacawberReformedSpellcaster],
        deck: 5,
      });

      const shiftTarget = testEngine.findCardInstanceId(
        morganaMacawberSelfcenteredSpellcaster,
        "play",
        PLAYER_ONE,
      );

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(morganaMacawberReformedSpellcaster)).toBe("play");
    });
  });

  describe("JUST FOR YOU - When you play this character, you may choose an opposing character and move 1 damage from each other character to them.", () => {
    it("is optional - can decline the ability", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: morganaMacawberReformedSpellcaster.cost,
          hand: [morganaMacawberReformedSpellcaster],
          play: [{ card: goofyKnightForADay, damage: 2 }],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster),
      ).toBeSuccessfulCommand();

      // Optional triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(morganaMacawberReformedSpellcaster, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage should remain on Goofy since we declined
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(2);
      expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(0);
    });

    it("moves 1 damage from each other character to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: morganaMacawberReformedSpellcaster.cost,
          hand: [morganaMacawberReformedSpellcaster],
          play: [
            { card: goofyKnightForADay, damage: 3 },
            { card: elsaQueenRegent, damage: 2 },
          ],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 5,
        },
      );

      const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster),
      ).toBeSuccessfulCommand();

      // Accept the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(morganaMacawberReformedSpellcaster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Choose the target opposing character
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Each character should have 1 damage moved to Mickey
      // Goofy: 3 - 1 = 2 damage remaining
      // Elsa: 2 - 1 = 1 damage remaining
      // Mickey: 0 + 1 + 1 = 2 damage (1 from each other character)
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(2);
      expect(testEngine.asPlayerOne().getDamage(elsaQueenRegent)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(2);
    });

    it("only moves 1 damage per character even if they have more", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: morganaMacawberReformedSpellcaster.cost,
          hand: [morganaMacawberReformedSpellcaster],
          play: [{ card: goofyKnightForADay, damage: 5 }],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 5,
        },
      );

      const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(morganaMacawberReformedSpellcaster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Only 1 damage should be moved from Goofy
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(4);
      expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(1);
    });

    it("does not move damage from characters with 0 damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: morganaMacawberReformedSpellcaster.cost,
          hand: [morganaMacawberReformedSpellcaster],
          play: [
            { card: goofyKnightForADay, damage: 2 },
            elsaQueenRegent, // No damage
          ],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 5,
        },
      );

      const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(morganaMacawberReformedSpellcaster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Only 1 damage from Goofy should be moved
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(elsaQueenRegent)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(1);
    });

    it("moves damage from opponent's characters too (each OTHER character)", () => {
      const aladdinMock = createMockCharacter({
        id: "morgana-test-aladdin",
        name: "Aladdin Mock",
        cost: 2,
        strength: 2,
        willpower: 4,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: morganaMacawberReformedSpellcaster.cost,
          hand: [morganaMacawberReformedSpellcaster],
          play: [{ card: goofyKnightForADay, damage: 2 }],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend, { card: aladdinMock, damage: 1 }],
          deck: 5,
        },
      );

      const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(morganaMacawberReformedSpellcaster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // 1 damage from Goofy + 1 damage from Aladdin = 2 damage on Mickey
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(aladdinMock)).toBe(0);
      expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(2);
    });

    it("does not move damage from the target character to itself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: morganaMacawberReformedSpellcaster.cost,
          hand: [morganaMacawberReformedSpellcaster],
          play: [{ card: goofyKnightForADay, damage: 2 }],
          deck: 5,
        },
        {
          play: [{ card: elsaQueenRegent, damage: 2 }], // Elsa has 4 willpower
          deck: 5,
        },
      );

      const targetId = testEngine.findCardInstanceId(elsaQueenRegent, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(morganaMacawberReformedSpellcaster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Elsa should NOT move damage from itself to itself
      // Only Goofy's damage should be moved
      // Goofy: 2 - 1 = 1
      // Elsa: 2 + 1 = 3 (not 2 + 1 + 1 from itself)
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(elsaQueenRegent)).toBe(3);
    });

    it("triggers when played via Shift", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: 4,
          hand: [morganaMacawberReformedSpellcaster],
          play: [morganaMacawberSelfcenteredSpellcaster, { card: goofyKnightForADay, damage: 2 }],
          deck: 5,
        },
        {
          play: [mickeyMouseTrueFriend],
          deck: 5,
        },
      );

      const shiftTarget = testEngine.findCardInstanceId(
        morganaMacawberSelfcenteredSpellcaster,
        "play",
        PLAYER_ONE,
      );
      const targetId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(morganaMacawberReformedSpellcaster, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      // Accept the optional ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(morganaMacawberReformedSpellcaster, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Damage should be moved
      expect(testEngine.asPlayerOne().getDamage(goofyKnightForADay)).toBe(1);
      expect(testEngine.asPlayerTwo().getDamage(mickeyMouseTrueFriend)).toBe(1);
    });
  });
});
