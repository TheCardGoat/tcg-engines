import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockItem,
} from "./index";

const action = createMockAction({
  id: "referenced-return-action",
  name: "Return Selected Pair",
  cost: 3,
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "select-target",
            target: {
              selector: "chosen",
              count: 2,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          { type: "return-to-hand", target: { reference: "selected-all" } },
        ],
      },
    },
  ],
});
const first = createMockCharacter({ id: "referenced-first", name: "First", cost: 1 });
const second = createMockCharacter({ id: "referenced-second", name: "Second", cost: 1 });
const enemy = createMockCharacter({ id: "referenced-enemy", name: "Enemy", cost: 1 });
const item = createMockItem({ id: "referenced-item", name: "Item", cost: 1 });

describe("referenced return-to-hand target validation", () => {
  for (const invalid of [enemy, item]) {
    it(`rejects ${invalid.name} before payment without widening the earlier selection`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [action], play: [first, second, item], inkwell: 3 },
        { play: [enemy] },
      );
      expect(
        engine.asPlayerOne().playCard(action, { targets: [first, invalid] }),
      ).not.toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(action)).toBe("hand");
      expect(engine.asPlayerOne().getCardZone(first)).toBe("play");
      expect(engine.asPlayerTwo().getCardZone(enemy)).toBe("play");
      expect(
        engine.asPlayerOne().playCard(action, { targets: [first, second] }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(first)).toBe("hand");
      expect(engine.asPlayerOne().getCardZone(second)).toBe("hand");
    });
  }
});
