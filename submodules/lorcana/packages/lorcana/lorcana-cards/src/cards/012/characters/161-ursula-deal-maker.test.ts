import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ursulaDealMaker } from "./161-ursula-deal-maker";

const allyCharacter = createMockCharacter({
  id: "ursula-deal-maker-ally",
  name: "Friendly Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const secondAlly = createMockCharacter({
  id: "ursula-deal-maker-second-ally",
  name: "Second Ally",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
});

describe("Ursula - Deal Maker", () => {
  describe("QUITE THE BARGAIN - When you play this character and whenever she quests, another chosen character gets +1 {L} this turn.", () => {
    it("gives another chosen character +1 lore this turn when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [ursulaDealMaker],
        inkwell: ursulaDealMaker.cost,
        play: [{ card: allyCharacter, isDrying: false }],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(ursulaDealMaker)).toBeSuccessfulCommand();
      expect(
        playerOne.resolvePendingByCard(ursulaDealMaker, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardLore(allyCharacter)).toBe(allyCharacter.lore + 1);
    });

    it("gives another chosen character +1 lore this turn whenever she quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ursulaDealMaker, isDrying: false },
          { card: allyCharacter, isDrying: false },
        ],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.quest(ursulaDealMaker)).toBeSuccessfulCommand();
      expect(
        playerOne.resolvePendingByCard(ursulaDealMaker, {
          resolveOptional: true,
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardLore(allyCharacter)).toBe(allyCharacter.lore + 1);
    });

    it("cannot target Ursula herself (another chosen character)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: ursulaDealMaker, isDrying: false }],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.quest(ursulaDealMaker)).toBeSuccessfulCommand();

      const rejected = playerOne.resolvePendingByCard(ursulaDealMaker, {
        resolveOptional: true,
        targets: [ursulaDealMaker],
      });
      expect(rejected.success).toBe(false);
    });
  });

  describe("BY THE WAY - At the end of your turn, if this character is exerted, put chosen character of yours into your inkwell facedown and exerted.", () => {
    it("puts a chosen owned character into your inkwell facedown and exerted when Ursula is exerted at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ursulaDealMaker, isDrying: false },
          { card: allyCharacter, isDrying: false },
        ],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      // Quest with Ursula so she is exerted at end of turn.
      expect(playerOne.quest(ursulaDealMaker)).toBeSuccessfulCommand();
      // Decline QUITE THE BARGAIN so only BY THE WAY remains for end of turn handling.
      expect(
        playerOne.resolvePendingByCard(ursulaDealMaker, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(playerOne.passTurn()).toBeSuccessfulCommand();

      // BY THE WAY triggers — player one picks the ally to go to their inkwell.
      expect(
        playerOne.resolvePendingByCard(ursulaDealMaker, {
          targets: [allyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(allyCharacter)).toBe("inkwell");
    });

    it("does not trigger when Ursula is ready at end of turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: ursulaDealMaker, isDrying: false },
          { card: allyCharacter, isDrying: false },
          { card: secondAlly, isDrying: false },
        ],
        deck: 3,
      });

      const playerOne = testEngine.asPlayerOne();

      // Ursula is ready (never quested/exerted). End the turn.
      expect(playerOne.passTurn()).toBeSuccessfulCommand();

      // Neither ally should have moved to inkwell.
      expect(playerOne.getCardZone(allyCharacter)).toBe("play");
      expect(playerOne.getCardZone(secondAlly)).toBe("play");
    });
  });
});
