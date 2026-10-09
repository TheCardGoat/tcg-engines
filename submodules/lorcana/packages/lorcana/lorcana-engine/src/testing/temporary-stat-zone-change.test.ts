// CR 7.1.6: a character becomes a new object when it leaves play.
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, createMockAction } from "./index";
const target = createMockCharacter({
  id: "zone-stat-target",
  name: "Target",
  cost: 1,
  strength: 2,
});
const other = createMockCharacter({ id: "zone-stat-other", name: "Other", cost: 1, strength: 1 });
const buff = createMockAction({
  id: "zone-stat-buff",
  name: "Buff",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
});
const bounce = createMockAction({
  id: "zone-stat-bounce",
  name: "Bounce",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
});
const banish = createMockAction({
  id: "zone-stat-banish",
  name: "Banish",
  cost: 0,
  abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
});
const recover = createMockAction({
  id: "zone-stat-recover",
  name: "Recover",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["discard"],
          cardTypes: ["character"],
        },
      },
    },
  ],
});
describe("temporary stats after leaving play", () => {
  for (const leave of [bounce, banish])
    it(`clears the target's modifier after ${leave.name} and replay without clearing other targets`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [target, other],
        hand: [buff, buff, leave, recover],
        inkwell: 1,
      });
      expect(g.asPlayerOne().playCard(buff, { targets: [target] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().playCard(buff, { targets: [other] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(target)).toBe(4);
      expect(g.asPlayerOne().getCardStrength(other)).toBe(3);
      expect(g.asPlayerOne().playCard(leave, { targets: [target] })).toBeSuccessfulCommand();
      if (leave === banish)
        expect(g.asPlayerOne().playCard(recover, { targets: [target] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().playCard(target)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(target)).toBe(2);
      expect(g.asPlayerOne().getCardStrength(other)).toBe(3);
    });
});
