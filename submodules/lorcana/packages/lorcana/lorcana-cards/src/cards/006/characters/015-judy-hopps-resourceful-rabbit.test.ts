import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { judyHoppsResourcefulRabbit } from "./015-judy-hopps-resourceful-rabbit";

const ally = createMockCharacter({
  id: "judy-hopps-ally",
  name: "Ally",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

describe("Judy Hopps - Resourceful Rabbit", () => {
  it("has Support keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [judyHoppsResourcefulRabbit],
    });

    expect(testEngine.hasKeyword(judyHoppsResourcefulRabbit, "Support")).toBe(true);
  });

  describe("NEED SOME HELP? - At the end of your turn, you may ready another chosen character of yours.", () => {
    it("triggers at the end of your turn and readies chosen ally character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [judyHoppsResourcefulRabbit, { card: ally, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Pass turn to trigger end-of-turn effect
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Should have a bag effect for the triggered ability
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional and choose the ally to ready
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(judyHoppsResourcefulRabbit, {
          resolveOptional: true,
          targets: [ally],
        }),
      ).toBeSuccessfulCommand();

      // Ally should now be readied
      expect(testEngine.asPlayerOne().isExerted(ally)).toBe(false);
    });

    it("does not ready the ally when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [judyHoppsResourcefulRabbit, { card: ally, exerted: true }],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(judyHoppsResourcefulRabbit, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Ally should still be exerted
      expect(testEngine.asPlayerOne().isExerted(ally)).toBe(true);
    });

    it("does not trigger on the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 2,
        },
        {
          play: [judyHoppsResourcefulRabbit, { card: ally, exerted: true }],
          deck: 2,
        },
      );

      // Player one passes turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Player two has Judy Hopps but this is player one's turn end, not player two's
      // Judy Hopps should NOT trigger from player one's end of turn
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JudyHoppsResourcefulRabbit,
//   PrincipeNaveenCarefreeExplorer,
// } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Judy Hopps - Resourceful Rabbit", () => {
//   It("NEED SOME HELP? At the end of your turn, you may ready another chosen character of yours.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [judyHoppsResourcefulRabbit, principeNaveenCarefreeExplorer],
//     });
//
//     Const target = testEngine.getCardModel(principeNaveenCarefreeExplorer);
//
//     Await testEngine.tapCard(principeNaveenCarefreeExplorer);
//
//     Expect(testEngine.store.turnCount).toBe(0);
//     Await testEngine.passTurn("player_one", true);
//     Expect(testEngine.store.turnCount).toBe(0);
//
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(target.ready).toEqual(false);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//     Expect(target.ready).toEqual(true);
//
//     Expect(testEngine.store.turnCount).toBe(1);
//     Expect(testEngine.store.priorityPlayer).toBe("player_two");
//     Expect(testEngine.store.turnPlayer).toBe("player_two");
//   });
// });
//
