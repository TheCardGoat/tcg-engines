import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockItem,
  PLAYER_ONE,
  PLAYER_TWO,
} from "./index";

const action = createMockAction({
  id: "slotted-damage-action",
  name: "Move Damage",
  cost: 2,
  abilities: [
    {
      type: "action",
      effect: {
        type: "move-damage",
        amount: { type: "up-to", value: 3 },
        from: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
});
const ally = createMockCharacter({ id: "slotted-ally", name: "Ally", cost: 1, willpower: 5 });
const enemy = createMockCharacter({ id: "slotted-enemy", name: "Enemy", cost: 1, willpower: 5 });
const item = createMockItem({ id: "slotted-item", name: "Item", cost: 1 });

describe("slotted damage action validation", () => {
  for (const invalid of ["friendly-destination", "item-source", "two-sources"] as const) {
    it(`rejects ${invalid} before paying the action cost`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [action], play: [{ card: ally, damage: 3 }, item], inkwell: 2 },
        { play: [enemy] },
      );
      expect(
        engine.asPlayerOne().playCard(action, {
          targets: {
            kind: "move-damage",
            from:
              invalid === "item-source"
                ? [item]
                : invalid === "two-sources"
                  ? [ally, enemy]
                  : [ally],
            to: invalid === "friendly-destination" ? [ally] : [enemy],
          },
        }),
      ).not.toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(action)).toBe("hand");
      expect(engine.asPlayerOne().getDamage(ally)).toBe(3);
      expect(engine.asPlayerTwo().getDamage(enemy)).toBe(0);
      expect(
        engine.asPlayerOne().playCard(action, {
          targets: { kind: "move-damage", from: [ally], to: [enemy] },
          amount: 1,
        }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getDamage(ally)).toBe(2);
      expect(engine.asPlayerTwo().getDamage(enemy)).toBe(1);
    });
  }
  it("recognizes an opposing fixture made only of ink drops", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({ inkDrops: 2 }, { inkDrops: 4 });
    expect(engine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(engine.getInkDrops(PLAYER_TWO)).toBe(4);
  });
});
