import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { buzzsArm } from "./098-buzzs-arm";

const buzzLightyear = createMockCharacter({
  id: "buzzs-arm-buzz-lightyear",
  name: "Buzz Lightyear",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const heavyAttacker = createMockCharacter({
  id: "buzzs-arm-heavy-attacker",
  name: "Heavy Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

const nonBuzzCharacter = createMockCharacter({
  id: "buzzs-arm-non-buzz",
  name: "Woody",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const cheapAction = createMockAction({
  id: "buzzs-arm-cheap-action",
  name: "Cheap Action",
  cost: 2,
  abilities: [
    {
      id: "buzzs-arm-cheap-action-1",
      type: "action",
      effect: { type: "draw", amount: 1, target: "CONTROLLER" },
      text: "Draw a card.",
    },
  ],
});

const cheapItem = createMockItem({
  id: "buzzs-arm-cheap-item",
  name: "Cheap Item",
  cost: 2,
});

const cheapCharacter = createMockCharacter({
  id: "buzzs-arm-cheap-character",
  name: "Cheap Character",
  cost: 2,
});

describe("Buzz's Arm", () => {
  describe("MISSING PIECE - If a character named Buzz Lightyear was banished this turn, you may play this item for free.", () => {
    it("allows playing the item for free after Buzz Lightyear was banished this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [buzzsArm],
          inkwell: 0,
          play: [heavyAttacker],
        },
        {
          play: [{ card: buzzLightyear, exerted: true }],
        },
      );

      // Cannot play yet (no ink, Buzz still alive).
      expect(testEngine.asPlayerOne().canPlayCard(buzzsArm)).toBe(false);

      // Challenge to banish Buzz Lightyear.
      expect(
        testEngine.asPlayerOne().challenge(heavyAttacker, buzzLightyear),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(buzzLightyear)).toBe("discard");

      // Now we can play Buzz's Arm for free even with 0 ink.
      expect(testEngine.asPlayerOne().canPlayCard(buzzsArm)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(buzzsArm)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(buzzsArm)).toBe("play");
    });

    it("release notes ruling: Buzz's Arm cannot be played during the opponent's turn, even if a Buzz Lightyear was banished that turn", () => {
      // Q&A: Missing Piece doesn't change WHEN the item can be played, only
      // that it can be played for free. Normal "play only on your turn"
      // timing still applies.
      //
      // Setup: it is player one's turn. Player one banishes player two's
      // Buzz Lightyear, so `banishedCharactersThisTurn` is set this turn —
      // Missing Piece's free-play condition is satisfied. Player two holds
      // Buzz's Arm and would be able to play it for free if timing weren't
      // an issue. We assert during the SAME turn (no passTurn) so we're
      // observing the timing rule, not a metadata reset.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [heavyAttacker],
          deck: 5,
        },
        {
          hand: [buzzsArm],
          play: [{ card: buzzLightyear, exerted: true }],
          inkwell: 0,
          deck: 5,
        },
      );

      // Player one challenges and banishes player two's Buzz Lightyear.
      expect(
        testEngine.asPlayerOne().challenge(heavyAttacker, buzzLightyear),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(buzzLightyear)).toBe("discard");

      // Still player one's turn: Missing Piece's condition is met for player
      // two, but player two is not the active player, so they cannot play.
      // (No passTurn — that would reset turnMetadata.banishedCharactersThisTurn
      // and a `false` would be ambiguous.)
      expect(testEngine.asPlayerTwo().canPlayCard(buzzsArm)).toBe(false);
    });

    it("does not let you play for free if the banished character was not named Buzz Lightyear", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [buzzsArm],
          inkwell: 0,
          play: [heavyAttacker],
        },
        {
          play: [{ card: nonBuzzCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(heavyAttacker, nonBuzzCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(buzzsArm)).toBe(false);
    });
  });

  describe("SOME ASSEMBLY REQUIRED - {E} — You pay 1 {I} less for the next action or item you play this turn.", () => {
    it("reduces the cost of the next action you play this turn by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cheapAction],
        inkwell: cheapAction.cost - 1,
        play: [buzzsArm],
      });

      expect(testEngine.asPlayerOne().canPlayCard(cheapAction)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(buzzsArm, {
          ability: "SOME ASSEMBLY REQUIRED",
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(cheapAction)).toBe(true);
      expect(testEngine.asPlayerOne().isExerted(buzzsArm)).toBe(true);
    });

    it("reduces the cost of the next item you play this turn by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cheapItem],
        inkwell: cheapItem.cost - 1,
        play: [buzzsArm],
      });

      expect(testEngine.asPlayerOne().canPlayCard(cheapItem)).toBe(false);

      testEngine.asPlayerOne().activateAbility(buzzsArm, {
        ability: "SOME ASSEMBLY REQUIRED",
      });

      expect(testEngine.asPlayerOne().canPlayCard(cheapItem)).toBe(true);
    });

    it("does not reduce the cost of characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cheapCharacter],
        inkwell: cheapCharacter.cost - 1,
        play: [buzzsArm],
      });

      expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(false);

      testEngine.asPlayerOne().activateAbility(buzzsArm, {
        ability: "SOME ASSEMBLY REQUIRED",
      });

      expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(false);
    });
  });
});
