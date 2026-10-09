import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "./index";

const source = createMockCharacter({
  id: "or-choice-input",
  name: "Choice Source",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "or",
        options: [
          { type: "exert", target: "SELF" },
          { type: "gain-keyword", keyword: "Rush", duration: "this-turn", target: "SELF" },
        ],
      },
    },
  ],
});

describe("or choice request validation", () => {
  for (const deferred of [false, true]) {
    for (const choiceIndex of [-1, 0.5, 2, 100]) {
      it(`rejects ${choiceIndex} from ${deferred ? "pending effect" : "bag"} without consuming the choice`, () => {
        const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [source], inkwell: 1 });
        expect(game.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
        if (deferred) {
          expect(game.asPlayerOne().resolvePendingByCard(source, {})).toBeSuccessfulCommand();
          expect(game.asPlayerOne().getPendingEffects()).toHaveLength(1);
        }
        expect(
          game.asPlayerOne().resolvePendingByCard(source, { choiceIndex }),
        ).not.toBeSuccessfulCommand();
        expect(game.asPlayerOne().hasKeyword(source, "Rush")).toBe(false);
        expect(game.asPlayerOne().isExerted(source)).toBe(false);
        expect(
          game.asPlayerOne().resolvePendingByCard(source, { choiceIndex: 1 }),
        ).toBeSuccessfulCommand();
        expect(game.asPlayerOne().hasKeyword(source, "Rush")).toBe(true);
        expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
        expect(game.asPlayerOne().getBagEffects()).toHaveLength(0);
      });
    }
  }
});
