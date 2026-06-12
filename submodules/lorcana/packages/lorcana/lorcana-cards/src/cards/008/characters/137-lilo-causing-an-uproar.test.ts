import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { liloCausingAnUproar } from "./137-lilo-causing-an-uproar";

const action1 = createMockAction({
  id: "lilo-uproar-action-1",
  name: "Action 1",
  cost: 1,
});

const action2 = createMockAction({
  id: "lilo-uproar-action-2",
  name: "Action 2",
  cost: 1,
});

const action3 = createMockAction({
  id: "lilo-uproar-action-3",
  name: "Action 3",
  cost: 1,
});

const action4 = createMockAction({
  id: "lilo-uproar-action-4",
  name: "Action 4",
  cost: 1,
});

// An action that plays another action for free from hand (simulates Robin Hood Sharpshooter's
// MY GREATEST PERFORMANCE or similar effects that let you play actions for free).
const actionThatPlaysFreeAction = createMockAction({
  id: "lilo-uproar-play-free-action",
  name: "Play Free Action",
  cost: 1,
  abilities: [
    {
      id: "lilo-uproar-play-free-action-1",
      type: "action" as const,
      effect: {
        type: "play-card" as const,
        from: "hand" as const,
        cardType: "action" as const,
        cost: "free" as const,
      },
    },
  ],
});

const exertedCharacter = createMockCharacter({
  id: "lilo-uproar-exerted-char",
  name: "Exerted Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Lilo - Causing an Uproar", () => {
  describe("STOMPIN' TIME! - During your turn, if you've played 3 or more actions this turn, you may play this character for free.", () => {
    it("can be played for free after playing 3 actions this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar, action1, action2, action3],
        inkwell: 3,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(action2)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(action3)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(liloCausingAnUproar)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar)).toBeSuccessfulCommand();
    });

    it("can be played for free after playing 4 or more actions this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar, action1, action2, action3, action4],
        inkwell: 4,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(action2)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(action3)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(action4)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(liloCausingAnUproar)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar)).toBeSuccessfulCommand();
    });

    it("cannot be played for free with only 2 actions played this turn (no ink)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar, action1, action2],
        inkwell: 2,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(action2)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar).success).toBe(false);
      expect(testEngine.asPlayerOne().getCardZone(liloCausingAnUproar)).toBe("hand");
    });

    it("counts actions played for free via effects toward the 3-action threshold", () => {
      // Bug report: Player played 2 actions with ink and 1 for free via an ability,
      // but Lilo was still not free. Free-played actions must count toward the metric.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar, action1, actionThatPlaysFreeAction, action3],
        inkwell: 3,
        deck: 2,
      });

      // Play 2 actions with ink (action1 + actionThatPlaysFreeAction which also plays action3 for free)
      expect(testEngine.asPlayerOne().playCard(action1)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().playCard(actionThatPlaysFreeAction)).toBeSuccessfulCommand();

      // At this point 3 actions have been played: action1, actionThatPlaysFreeAction, and action3 (free)
      expect(testEngine.asPlayerOne().canPlayCard(liloCausingAnUproar)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar)).toBeSuccessfulCommand();
    });

    it("can still be played at full cost when fewer than 3 actions have been played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar],
        inkwell: liloCausingAnUproar.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(liloCausingAnUproar)).toBe("play");
    });
  });

  describe("RAAAWR! - When you play this character, ready chosen character. They can't quest for the rest of this turn.", () => {
    it("readies chosen exerted character and applies cant-quest restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar],
        inkwell: liloCausingAnUproar.cost,
        play: [{ card: exertedCharacter, exerted: true, isDrying: false }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(liloCausingAnUproar, {
          targets: [exertedCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(exertedCharacter)).toBe(false);
      expect(testEngine.hasRestriction(exertedCharacter, "cant-quest")).toBe(true);
    });

    it("cant-quest restriction expires after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar],
        inkwell: liloCausingAnUproar.cost,
        play: [{ card: exertedCharacter, exerted: true, isDrying: false }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(liloCausingAnUproar, {
          targets: [exertedCharacter],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.hasRestriction(exertedCharacter, "cant-quest")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(exertedCharacter, "cant-quest")).toBe(false);
    });

    it("can target a ready character and still applies cant-quest", () => {
      const readyCharacter = createMockCharacter({
        id: "lilo-uproar-ready-char",
        name: "Ready Character",
        cost: 2,
        strength: 3,
        willpower: 3,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [liloCausingAnUproar],
        inkwell: liloCausingAnUproar.cost,
        play: [{ card: readyCharacter, isDrying: false }],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(liloCausingAnUproar)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(liloCausingAnUproar, {
          targets: [readyCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().isExerted(readyCharacter)).toBe(false);
      expect(testEngine.hasRestriction(readyCharacter, "cant-quest")).toBe(true);
    });
  });
});
