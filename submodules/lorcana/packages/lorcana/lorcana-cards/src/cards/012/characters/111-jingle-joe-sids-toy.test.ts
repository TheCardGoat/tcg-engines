import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jingleJoeSidsToy } from "./111-jingle-joe-sids-toy";

const toyAlly = createMockCharacter({
  id: "jingle-joe-toy-ally",
  name: "Toy Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const nonToyAlly = createMockCharacter({
  id: "jingle-joe-non-toy-ally",
  name: "Non-Toy Ally",
  cost: 2,
  strength: 1,
  willpower: 1,
  classifications: ["Storyborn", "Ally"],
});

const chosenCharacter = createMockCharacter({
  id: "jingle-joe-chosen",
  name: "Chosen Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const banishAction = createMockAction({
  id: "jingle-joe-banish-action",
  name: "Banish Action",
  cost: 2,
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "banish",
      },
      type: "action",
    },
  ],
});

describe("Jingle Joe - Sid's Toy", () => {
  describe("Turn Out the Light - During your turn, whenever one of your other Toy characters is banished, chosen character of yours gains Evasive until the start of your next turn.", () => {
    it("grants Evasive to chosen character when another Toy character is banished during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: jingleJoeSidsToy, isDrying: false },
            { card: toyAlly, isDrying: false },
            { card: chosenCharacter, isDrying: false },
          ],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Banish our own Toy ally during our turn
      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [toyAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toyAlly)).toBe("discard");

      // Resolve Turn Out the Light, choosing the chosenCharacter
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jingleJoeSidsToy, {
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(chosenCharacter, "Evasive")).toBe(true);
    });

    it("does NOT trigger when a non-Toy character is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: jingleJoeSidsToy, isDrying: false },
            { card: nonToyAlly, isDrying: false },
            { card: chosenCharacter, isDrying: false },
          ],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [nonToyAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(nonToyAlly)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().hasKeyword(chosenCharacter, "Evasive")).toBe(false);
    });

    it("does NOT trigger when Jingle Joe himself is banished (only other Toy characters)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: jingleJoeSidsToy, isDrying: false },
            { card: chosenCharacter, isDrying: false },
          ],
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [jingleJoeSidsToy] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(jingleJoeSidsToy)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().hasKeyword(chosenCharacter, "Evasive")).toBe(false);
    });

    it("does NOT trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: jingleJoeSidsToy, isDrying: false },
            { card: toyAlly, isDrying: false },
            { card: chosenCharacter, isDrying: false },
          ],
          deck: 2,
        },
        {
          hand: [banishAction],
          inkwell: banishAction.cost,
          deck: 2,
        },
      );

      // Hand turn over to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent banishes our Toy ally during their turn
      expect(
        testEngine.asPlayerTwo().playCard(banishAction, { targets: [toyAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(toyAlly)).toBe("discard");

      // Trigger must NOT fire because it's not our turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().hasKeyword(chosenCharacter, "Evasive")).toBe(false);
    });
  });
});
