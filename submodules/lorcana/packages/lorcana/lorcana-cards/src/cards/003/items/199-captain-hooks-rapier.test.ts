import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { captainHookMasterSwordsman } from "../characters";
import { captainHooksRapier } from "./199-captain-hooks-rapier";

const victor = createMockCharacter({
  id: "captain-hooks-rapier-victor",
  name: "Victor",
  cost: 3,
  strength: 5,
  willpower: 5,
});

const doomedEnemy = createMockCharacter({
  id: "captain-hooks-rapier-doomed-enemy",
  name: "Doomed Enemy",
  cost: 2,
  strength: 1,
  willpower: 2,
});

const notCaptainHook = createMockCharacter({
  id: "captain-hooks-rapier-not-captain-hook",
  name: "Not Captain Hook",
  cost: 2,
});

describe("Captain Hook's Rapier", () => {
  describe("GET THOSE SCURVY BRATS! — During your turn, whenever one of your characters banishes another character in a challenge, you may pay 1 {I} to draw a card.", () => {
    it("triggers when one of your characters banishes another character in a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          inkwell: 1,
          play: [captainHooksRapier, { card: victor, isDrying: false }],
        },
        {
          play: [{ card: doomedEnemy, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(victor, doomedEnemy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(doomedEnemy)).toBe("discard");
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("draws a card when the optional pay 1 ink is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          inkwell: 1,
          play: [captainHooksRapier, { card: victor, isDrying: false }],
        },
        {
          play: [{ card: doomedEnemy, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(victor, doomedEnemy)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(captainHooksRapier),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 1 });
    });

    it("does not draw a card when the optional is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          inkwell: 1,
          play: [captainHooksRapier, { card: victor, isDrying: false }],
        },
        {
          play: [{ card: doomedEnemy, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(victor, doomedEnemy)).toBeSuccessfulCommand();

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(captainHooksRapier, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 2 });
    });

    it("does not trigger when opponent's character banishes yours", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
          play: [captainHooksRapier, { card: doomedEnemy, exerted: true }],
        },
        {
          play: [{ card: victor, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().challenge(victor, doomedEnemy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("LET'S HAVE AT IT! — Your characters named Captain Hook gain Challenger +1.", () => {
    it("gives Captain Hook characters Challenger +1 while the Rapier is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [captainHooksRapier, captainHookMasterSwordsman],
      });

      expect(
        testEngine.asPlayerOne().getKeywordValue(captainHookMasterSwordsman, "Challenger"),
      ).toBe(1);
    });

    it("does not give Challenger +1 to non-Captain-Hook characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [captainHooksRapier, notCaptainHook],
      });

      expect(testEngine.asPlayerOne().getKeywordValue(notCaptainHook, "Challenger")).toBeNull();
    });
  });
});
