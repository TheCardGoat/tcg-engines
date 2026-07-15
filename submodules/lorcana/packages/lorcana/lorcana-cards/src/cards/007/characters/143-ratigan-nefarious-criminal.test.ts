import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { ratiganNefariousCriminal } from "./143-ratigan-nefarious-criminal";

const testAction = createMockAction({
  id: "ratigan-test-action",
  name: "Test Action",
  cost: 1,
  text: "Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "draw",
        amount: 1,
      },
    },
  ],
});

describe("Ratigan - Nefarious Criminal", () => {
  describe("A MARVELOUS PERFORMANCE - Whenever you play an action while this character is exerted, gain 1 lore.", () => {
    it("gains 1 lore when an action is played while Ratigan is exerted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: ratiganNefariousCriminal, exerted: true }],
          hand: [testAction],
          inkwell: testAction.cost,
          deck: 2,
        },
        {
          deck: 1,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(testAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ratiganNefariousCriminal),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does NOT trigger when Ratigan is ready (not exerted)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ratiganNefariousCriminal],
          hand: [testAction],
          inkwell: testAction.cost,
          deck: 2,
        },
        {
          deck: 1,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(testAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });

    it("gains 1 lore when Ratigan is exerted via questing and an action is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [ratiganNefariousCriminal],
          hand: [testAction],
          inkwell: testAction.cost,
          deck: 2,
        },
        {
          deck: 1,
        },
      );

      // Quest to exert Ratigan
      expect(testEngine.asPlayerOne().quest(ratiganNefariousCriminal)).toBeSuccessfulCommand();

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().playCard(testAction, { preventAutoResolveTriggeredEffects: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(bagEffect).toBeDefined();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(ratiganNefariousCriminal),
      ).toBeSuccessfulCommand();

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });
  });
});
