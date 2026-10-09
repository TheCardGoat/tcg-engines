import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { alienTrueBeliever } from "./083-alien-true-believer";

const toyAlly1 = createMockCharacter({
  id: "alien-toy-ally-1",
  name: "Toy Ally 1",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const toyAlly2 = createMockCharacter({
  id: "alien-toy-ally-2",
  name: "Toy Ally 2",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const nonToyAlly = createMockCharacter({
  id: "alien-non-toy-ally",
  name: "Non-Toy Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  classifications: ["Storyborn", "Ally"],
});

const anotherAlien = createMockCharacter({
  id: "alien-another",
  name: "Alien",
  version: "Squad Member",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Alien", "Toy"],
});

describe("Alien - True Believer", () => {
  describe("WE ARE ONE - This character gets +1 {S} for each other Toy character you have in play.", () => {
    it("has base strength with no other Toy characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [alienTrueBeliever],
        deck: 3,
      });

      expect(testEngine.asPlayerOne().getCardStrength(alienTrueBeliever)).toBe(
        alienTrueBeliever.strength,
      );
    });

    it("gets +1 strength per other Toy character in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [alienTrueBeliever, toyAlly1, toyAlly2],
        deck: 3,
      });

      // 2 other Toy characters → +2 strength
      expect(testEngine.asPlayerOne().getCardStrength(alienTrueBeliever)).toBe(
        alienTrueBeliever.strength + 2,
      );
    });

    it("non-Toy characters do not count toward bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [alienTrueBeliever, nonToyAlly],
        deck: 3,
      });

      // Non-Toy ally does not trigger the bonus
      expect(testEngine.asPlayerOne().getCardStrength(alienTrueBeliever)).toBe(
        alienTrueBeliever.strength,
      );
    });
  });

  describe("HE HAS BEEN CHOSEN - During your turn, when banished, return another Alien from discard to hand.", () => {
    // CR 6.2.3: the banishment triggers the ability even after its source leaves play.
    it("returns another Alien and excludes the banished source from the choice", () => {
      const banishAction = createMockAction({
        id: "alien-own-turn-banish",
        name: "Own Turn Banish",
        cost: 1,
        abilities: [
          {
            type: "action",
            effect: { type: "banish", target: "CHOSEN_CHARACTER" },
          },
        ],
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [alienTrueBeliever],
        hand: [banishAction],
        discard: [anotherAlien],
        inkwell: 1,
        deck: 3,
      });
      const p1 = game.asPlayerOne();
      expect(p1.playCard(banishAction, { targets: [alienTrueBeliever] })).toBeSuccessfulCommand();
      expect(p1.getCardZone(alienTrueBeliever)).toBe("discard");
      expect(game.asServer().getState().G.pendingEffects).toHaveLength(1);
      expect(p1.resolveNextPending({ targets: [alienTrueBeliever] }).success).toBe(false);
      expect(p1.getCardZone(alienTrueBeliever)).toBe("discard");
      expect(p1.resolveNextPending({ targets: [anotherAlien] })).toBeSuccessfulCommand();
      expect(p1.getCardZone(anotherAlien)).toBe("hand");
      expect(p1.getCardZone(alienTrueBeliever)).toBe("discard");
      expect(game.asServer().getState().G.pendingEffects).toHaveLength(0);
    });
  });

  it("does not return an Alien when banished during the opponent's turn", () => {
    const banishAction = createMockAction({
      id: "alien-opponent-turn-banish",
      name: "Opponent Turn Banish",
      cost: 1,
      abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [alienTrueBeliever], discard: [anotherAlien], deck: 3 },
      { hand: [banishAction], inkwell: 1, deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(banishAction, { targets: [alienTrueBeliever] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(alienTrueBeliever)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(anotherAlien)).toBe("discard");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(game.asServer().getState().G.pendingEffects).toHaveLength(0);
  });

  describe("release notes ruling", () => {
    it("does NOT return a Stitch (Alien classification, name=Stitch) — the ability requires the card NAME to be 'Alien'", () => {
      // Q&A: He Has Been Chosen returns "another character card named Alien".
      // A Stitch with the Alien classification is not a card NAMED Alien and
      // cannot be returned by this ability.
      const stitchInDiscard = createMockCharacter({
        id: "alien-release-stitch",
        name: "Stitch",
        version: "Carefree Snowboarder",
        cost: 5,
        strength: 4,
        willpower: 5,
        lore: 2,
        classifications: ["Storyborn", "Hero", "Alien"],
      });

      const banishAction = createMockAction({
        id: "alien-release-banish",
        name: "Banish Action",
        cost: 3,
        abilities: [
          {
            id: "alien-release-banish-1",
            type: "action",
            text: "Banish chosen character.",
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
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: alienTrueBeliever, isDrying: false }],
        hand: [banishAction],
        inkwell: banishAction.cost,
        discard: [stitchInDiscard, anotherAlien],
        deck: 3,
      });

      expect(
        testEngine.asPlayerOne().playCard(banishAction, { targets: [alienTrueBeliever] }),
      ).toBeSuccessfulCommand();

      // Alien is in discard now.
      expect(testEngine.asPlayerOne().getCardZone(alienTrueBeliever)).toBe("discard");

      // A live choice must exclude the Alien classification when the card name is Stitch.
      expect(testEngine.asServer().getState().G.pendingEffects).toHaveLength(1);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [stitchInDiscard] }).success,
      ).toBe(false);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [anotherAlien] }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(anotherAlien)).toBe("hand");

      // Stitch must NOT have been returned to hand — name is "Stitch", not "Alien".
      expect(testEngine.asPlayerOne().getCardZone(stitchInDiscard)).toBe("discard");
    });
  });
});
