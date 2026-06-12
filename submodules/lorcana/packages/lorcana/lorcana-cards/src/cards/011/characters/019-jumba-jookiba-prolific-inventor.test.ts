import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jumbaJookibaProlificInventor } from "./019-jumba-jookiba-prolific-inventor";

const allyOne = createMockCharacter({
  id: "jumba-test-ally-one",
  name: "Ally One",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const allyTwo = createMockCharacter({
  id: "jumba-test-ally-two",
  name: "Ally Two",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const damagedTarget = createMockCharacter({
  id: "jumba-test-damaged-target",
  name: "Damaged Target",
  cost: 3,
  strength: 2,
  willpower: 5,
});

describe("Jumba Jookiba - Prolific Inventor", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [jumbaJookibaProlificInventor],
      inkwell: jumbaJookibaProlificInventor.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(jumbaJookibaProlificInventor)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(jumbaJookibaProlificInventor)).toBe("play");
  });

  describe("WELCOMING CROWD - For each character you have in play, you pay 1 {I} less to play this character.", () => {
    it("reduces cost by 1 for each character in play (2 characters = 2 less)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [allyOne, allyTwo],
        hand: [jumbaJookibaProlificInventor],
        // Cost 8 - 2 characters = 6 ink needed
        inkwell: jumbaJookibaProlificInventor.cost - 2,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(jumbaJookibaProlificInventor),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(jumbaJookibaProlificInventor)).toBe("play");
    });

    it("reduces cost by 1 for each character in play (1 character = 1 less)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [allyOne],
        hand: [jumbaJookibaProlificInventor],
        // Cost 8 - 1 character = 7 ink needed
        inkwell: jumbaJookibaProlificInventor.cost - 1,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(jumbaJookibaProlificInventor),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(jumbaJookibaProlificInventor)).toBe("play");
    });

    it("cannot be played with 2 less ink when only 1 character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [allyOne],
        hand: [jumbaJookibaProlificInventor],
        // Only 1 character in play, so discount is 1 — 2 less ink is not enough
        inkwell: jumbaJookibaProlificInventor.cost - 2,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(jumbaJookibaProlificInventor),
      ).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(jumbaJookibaProlificInventor)).toBe("hand");
    });

    it("has no discount when no characters are in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [jumbaJookibaProlificInventor],
        // No characters in play — full cost required
        inkwell: jumbaJookibaProlificInventor.cost - 1,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(jumbaJookibaProlificInventor),
      ).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(jumbaJookibaProlificInventor)).toBe("hand");
    });

    it("does not count opponent's characters for the discount", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jumbaJookibaProlificInventor],
          // No discount should apply — opponent's characters don't count
          inkwell: jumbaJookibaProlificInventor.cost - 1,
          deck: 5,
        },
        {
          play: [allyOne, allyTwo],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jumbaJookibaProlificInventor),
      ).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(jumbaJookibaProlificInventor)).toBe("hand");
    });

    it("verifies ink consumed matches reduced cost", () => {
      // 2 characters in play → 2 ink reduction
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [allyOne, allyTwo],
        hand: [jumbaJookibaProlificInventor],
        inkwell: 10,
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(jumbaJookibaProlificInventor),
      ).toBeSuccessfulCommand();
      // 10 - (8 - 2) = 4 remaining
      expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    });
  });

  describe("I AM HELPING - Whenever this character quests, you may remove all damage from chosen character.", () => {
    it("removes all damage from a chosen character when questing (accept)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: jumbaJookibaProlificInventor, isDrying: false },
          { card: damagedTarget, damage: 4 },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(jumbaJookibaProlificInventor)).toBeSuccessfulCommand();

      // I AM HELPING triggers as optional
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jumbaJookibaProlificInventor, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedTarget] }),
      ).toBeSuccessfulCommand();

      // All damage removed
      expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedTarget, value: 0 });
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: jumbaJookibaProlificInventor, isDrying: false },
          { card: damagedTarget, damage: 3 },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(jumbaJookibaProlificInventor)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jumbaJookibaProlificInventor, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Damage unchanged
      expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedTarget, value: 3 });
    });

    it("can remove damage from Jumba himself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: jumbaJookibaProlificInventor, isDrying: false, damage: 2 }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(jumbaJookibaProlificInventor)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jumbaJookibaProlificInventor, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [jumbaJookibaProlificInventor] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: jumbaJookibaProlificInventor,
        value: 0,
      });
    });

    it("also gains lore when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: jumbaJookibaProlificInventor, isDrying: false }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(jumbaJookibaProlificInventor)).toBeSuccessfulCommand();

      // Decline optional
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(jumbaJookibaProlificInventor, { resolveOptional: false });

      expect(testEngine.getLore(PLAYER_ONE)).toBe(jumbaJookibaProlificInventor.lore);
    });
  });
});
