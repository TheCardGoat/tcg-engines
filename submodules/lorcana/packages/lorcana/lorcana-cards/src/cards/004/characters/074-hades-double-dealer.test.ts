import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hadesDoubleDealer } from "./074-hades-double-dealer";

const mickeyBraveLittleTailor = createMockCharacter({
  id: "hades-double-dealer-mickey-brave-little-tailor",
  name: "Mickey Mouse",
  cost: 8,
});

const mickeyMouseTrueFriend = createMockCharacter({
  id: "hades-double-dealer-mickey-mouse-true-friend",
  name: "Mickey Mouse",
  cost: 3,
});

const madamMimFox = createMockCharacter({
  id: "hades-double-dealer-madam-mim-fox",
  name: "Madam Mim",
  cost: 3,
});

describe("Hades - Double Dealer", () => {
  describe("HERE'S THE TRADE-OFF - {E}, Banish one of your other characters - Play a character with the same name as the banished character for free.", () => {
    it("banishes another one of your characters and plays a same-name character from your hand for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hadesDoubleDealer, mickeyBraveLittleTailor],
        hand: [mickeyMouseTrueFriend, madamMimFox],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(hadesDoubleDealer, {
          ability: "HERE'S THE TRADE-OFF",
          costs: {
            banishCharacters: [
              testEngine.findCardInstanceId(mickeyBraveLittleTailor, "play", "player_one"),
            ],
          },
          targets: [mickeyMouseTrueFriend],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(mickeyBraveLittleTailor)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(mickeyMouseTrueFriend)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(madamMimFox)).toBe("hand");
      expect(testEngine.asPlayerOne().isExerted(hadesDoubleDealer)).toBe(true);
    });

    it("does not let you banish Hades himself as the character cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hadesDoubleDealer],
        hand: [mickeyMouseTrueFriend],
      });

      expect(
        testEngine.asPlayerOne().activateAbility(hadesDoubleDealer, {
          ability: "HERE'S THE TRADE-OFF",
          costs: {
            banishCharacters: [
              testEngine.findCardInstanceId(hadesDoubleDealer, "play", "player_one"),
            ],
          },
          targets: [mickeyMouseTrueFriend],
        }).success,
      ).toBe(false);
    });

    it("does not let you play a character with a different name than the banished character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [hadesDoubleDealer, mickeyBraveLittleTailor],
        hand: [madamMimFox],
      });

      testEngine.asPlayerOne().activateAbility(hadesDoubleDealer, {
        ability: "HERE'S THE TRADE-OFF",
        costs: {
          banishCharacters: [
            testEngine.findCardInstanceId(mickeyBraveLittleTailor, "play", "player_one"),
          ],
        },
        targets: [madamMimFox],
      });

      expect(testEngine.asPlayerOne().getCardZone(mickeyBraveLittleTailor)).toBe("play");
      expect(testEngine.asPlayerOne().getCardZone(madamMimFox)).toBe("hand");
      expect(testEngine.asPlayerOne().getCardZone(hadesDoubleDealer)).toBe("play");
      expect(testEngine.asPlayerOne().isExerted(hadesDoubleDealer)).toBe(false);
    });
  });
});
