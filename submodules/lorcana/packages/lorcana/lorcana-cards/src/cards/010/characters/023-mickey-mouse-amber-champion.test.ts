import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { mickeyMouseAmberChampion } from "./023-mickey-mouse-amber-champion";
import { shantiVillageGirl } from "./013-shanti-village-girl";
import { gazelleBalladSinger } from "./025-gazelle-ballad-singer";

const rubyCharacter = createMockCharacter({
  id: "ruby-char-for-mickey-test",
  name: "Ruby Character",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkType: ["ruby"],
});

/** THE-971: moves a chosen character from play into its owner's inkwell (exerted, facedown). */
const putChosenCharacterIntoInkwell = createMockAction({
  id: "put-chosen-character-into-inkwell-mickey-test",
  name: "Put Chosen Character Into Inkwell",
  cost: 2,
  text: "Put chosen character into their player's inkwell facedown and exerted.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CHOSEN_CHARACTER",
        facedown: true,
        exerted: true,
      },
    },
  ],
});

describe("Mickey Mouse - Amber Champion", () => {
  describe("LEADING THE WAY - +2 willpower to other Amber characters", () => {
    it("should give other Amber characters +2 willpower", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion, shantiVillageGirl],
      });

      const shanti = testEngine.asPlayerOne().getCard(shantiVillageGirl);
      const mickey = testEngine.asPlayerOne().getCard(mickeyMouseAmberChampion);

      expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
      expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
    });

    it("should not give willpower bonus to non-Amber characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion, rubyCharacter],
      });

      const rubyChar = testEngine.asPlayerOne().getCard(rubyCharacter);
      const mickey = testEngine.asPlayerOne().getCard(mickeyMouseAmberChampion);

      expect(rubyChar.willpower).toBe(rubyCharacter.willpower);
      expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
    });

    it("should buff multiple Amber characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion, shantiVillageGirl, gazelleBalladSinger],
      });

      const shanti = testEngine.asPlayerOne().getCard(shantiVillageGirl);
      const gazelle = testEngine.asPlayerOne().getCard(gazelleBalladSinger);

      expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
      expect(gazelle.willpower).toBe(gazelleBalladSinger.willpower + 2);
    });

    it("THE-971: removes LEADING THE WAY after Mickey leaves play via put-into-inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseAmberChampion, shantiVillageGirl],
          deck: 1,
        },
        {
          hand: [putChosenCharacterIntoInkwell],
          inkwell: putChosenCharacterIntoInkwell.cost,
          deck: 1,
        },
      );

      const shantiBefore = testEngine.asPlayerOne().getCard(shantiVillageGirl);
      expect(shantiBefore.willpower).toBe(shantiVillageGirl.willpower + 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(putChosenCharacterIntoInkwell, {
          targets: [mickeyMouseAmberChampion],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseAmberChampion)).toBe("inkwell");

      const shantiAfter = testEngine.asPlayerOne().getCard(shantiVillageGirl);
      expect(shantiAfter.willpower).toBe(shantiVillageGirl.willpower);
    });

    it("THE-971: banishes other Amber characters with lethal damage after Mickey enters inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mickeyMouseAmberChampion, { card: shantiVillageGirl, damage: 6 }],
          deck: 1,
        },
        {
          hand: [putChosenCharacterIntoInkwell],
          inkwell: putChosenCharacterIntoInkwell.cost,
          deck: 1,
        },
      );

      const shantiBefore = testEngine.asPlayerOne().getCard(shantiVillageGirl);
      expect(shantiBefore.damage).toBe(6);
      expect(shantiBefore.willpower).toBe(shantiVillageGirl.willpower + 2);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().playCard(putChosenCharacterIntoInkwell, {
          targets: [mickeyMouseAmberChampion],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(shantiVillageGirl)).toBe("discard");
    });
  });

  describe("FRIENDLY CHORUS - Singer 8 with 2+ other Amber characters", () => {
    it("should not have Singer when alone", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion],
      });

      expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(false);
    });

    it("should not have Singer with only 1 other Amber character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion, shantiVillageGirl],
      });

      expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(false);
    });

    it("should gain Singer with 2 other Amber characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion, shantiVillageGirl, gazelleBalladSinger],
      });

      expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(true);
    });

    it("should not count non-Amber characters towards the condition", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion, shantiVillageGirl, rubyCharacter],
      });

      expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(false);
    });

    it("regression: Singer 8 allows Mickey to sing a cost-8 song when 2+ other Amber characters in play", () => {
      const expensiveSong = createMockSong({
        id: "mickey-amber-champion-expensive-song",
        name: "Expensive Song",
        cost: 8,
        text: "A cost 8 song.",
        abilities: [],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: mickeyMouseAmberChampion, isDrying: false },
          shantiVillageGirl,
          gazelleBalladSinger,
        ],
        hand: [expensiveSong],
        inkwell: 0,
      });

      // Mickey should have Singer 8 with 2+ other Amber characters
      expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(true);

      const songId = testEngine.findCardInstanceId(expensiveSong, "hand", "player_one");
      const mickeyId = testEngine.findCardInstanceId(
        mickeyMouseAmberChampion,
        "play",
        "player_one",
      );

      expect(testEngine.asPlayerOne().getMoveOptions("singCard", songId)).toEqual([
        { kind: "card", cardId: mickeyId },
      ]);

      // Mickey should be able to sing the cost-8 song
      expect(
        testEngine.asPlayerOne().singSong(expensiveSong, mickeyMouseAmberChampion),
      ).toBeSuccessfulCommand();

      // Song should have been played
      expect(testEngine.asPlayerOne().getCardZone(expensiveSong)).toBe("discard");
    });

    it("should work correctly when both abilities are active", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [mickeyMouseAmberChampion, shantiVillageGirl, gazelleBalladSinger],
      });

      const mickey = testEngine.asPlayerOne().getCard(mickeyMouseAmberChampion);
      const shanti = testEngine.asPlayerOne().getCard(shantiVillageGirl);
      const gazelle = testEngine.asPlayerOne().getCard(gazelleBalladSinger);

      expect(shanti.willpower).toBe(shantiVillageGirl.willpower + 2);
      expect(gazelle.willpower).toBe(gazelleBalladSinger.willpower + 2);
      expect(testEngine.asPlayerOne().hasKeyword(mickeyMouseAmberChampion, "Singer")).toBe(true);
      expect(mickey.willpower).toBe(mickeyMouseAmberChampion.willpower);
    });
  });
});
