import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jebidiahFarnsworthExpeditionCook } from "./174-jebidiah-farnsworth-expedition-cook";

const resistTarget = createMockCharacter({
  id: "jebidiah-test-resist-target",
  name: "Resist Target",
  cost: 2,
  strength: 3,
  willpower: 4,
  lore: 1,
});

const attacker = createMockCharacter({
  id: "jebidiah-test-attacker",
  name: "Attacker",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
});

describe("Jebidiah Farnsworth - Expedition Cook", () => {
  describe("Support", () => {
    it("has the Support keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: jebidiahFarnsworthExpeditionCook, isDrying: false }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().hasKeyword(jebidiahFarnsworthExpeditionCook, "Support")).toBe(
        true,
      );
    });
  });

  describe("I GOT YOUR FOUR BASIC FOOD GROUPS - When you play this character, chosen character gains Resist +1 until the start of your next turn.", () => {
    it("grants Resist +1 to the chosen character after playing Jebidiah", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jebidiahFarnsworthExpeditionCook.cost,
          hand: [jebidiahFarnsworthExpeditionCook],
          play: [resistTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(false);

      expect(
        testEngine.asPlayerOne().playCard(jebidiahFarnsworthExpeditionCook),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jebidiahFarnsworthExpeditionCook, {
          resolveOptional: true,
          targets: [resistTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(true);
      expect(testEngine.asPlayerOne().getKeywordValue(resistTarget, "Resist")).toBe(1);
    });

    it("Resist +1 expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jebidiahFarnsworthExpeditionCook.cost,
          hand: [jebidiahFarnsworthExpeditionCook],
          play: [resistTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jebidiahFarnsworthExpeditionCook),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jebidiahFarnsworthExpeditionCook, {
          resolveOptional: true,
          targets: [resistTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(true);

      // Player one passes turn — Resist should still be active during opponent's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(true);

      // Opponent passes turn — Resist expires at start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(false);
    });

    it("Resist +1 reduces damage taken in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jebidiahFarnsworthExpeditionCook.cost,
          hand: [jebidiahFarnsworthExpeditionCook],
          play: [{ card: resistTarget, exerted: true }],
          deck: 2,
        },
        {
          play: [attacker],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jebidiahFarnsworthExpeditionCook),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jebidiahFarnsworthExpeditionCook, {
          resolveOptional: true,
          targets: [resistTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(true);

      // Pass to opponent's turn — Resist should still be active until start of player one's next turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(true);

      // attacker (str 4) challenges resistTarget (willpower 4, Resist +1) — should take 4-1=3 damage
      expect(testEngine.asPlayerTwo().challenge(attacker, resistTarget)).toBeSuccessfulCommand();

      const targetCard = testEngine.asPlayerOne().getCard(resistTarget);
      // Resist +1 reduces incoming damage by 1: attacker str 4 → 4-1=3 damage on target
      expect(targetCard.damage).toBe(attacker.strength - 1);
    });

    it("is optional and can be declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: jebidiahFarnsworthExpeditionCook.cost,
          hand: [jebidiahFarnsworthExpeditionCook],
          play: [resistTarget],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jebidiahFarnsworthExpeditionCook),
      ).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jebidiahFarnsworthExpeditionCook, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Resist not granted since the effect was declined
      expect(testEngine.asPlayerOne().hasKeyword(resistTarget, "Resist")).toBe(false);
    });
  });
});
