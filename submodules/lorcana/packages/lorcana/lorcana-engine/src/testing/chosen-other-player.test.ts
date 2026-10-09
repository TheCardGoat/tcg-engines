import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction, PLAYER_ONE, PLAYER_TWO } from "./index";

describe("chosen player controller exclusion", () => {
  for (const excludeSelf of [false, true]) {
    for (const target of [PLAYER_ONE, PLAYER_TWO]) {
      it(`handles excludeSelf=${excludeSelf} with ${target}`, () => {
        const action = createMockAction({
          id: "chosen-player-drops",
          name: "Chosen Drops",
          cost: 1,
          abilities: [
            {
              type: "action",
              effect: {
                type: "gain-ink-drop",
                amount: 1,
                target: { selector: "chosen", count: 1, excludeSelf },
              },
            },
          ],
        });
        const game = LorcanaMultiplayerTestEngine.createWithFixture(
          { hand: [action], inkwell: 1, deck: 6 },
          { deck: 6 },
        );
        const result = game.asPlayerOne().playCard(action, { targets: [target] });
        if (excludeSelf && target === PLAYER_ONE) {
          expect(result).not.toBeSuccessfulCommand();
          expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
          expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
        } else {
          expect(result).toBeSuccessfulCommand();
          expect(game.getInkDrops(target)).toBe(1);
          expect(game.getInkDrops(target === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)).toBe(0);
        }
      });
    }
  }
});
