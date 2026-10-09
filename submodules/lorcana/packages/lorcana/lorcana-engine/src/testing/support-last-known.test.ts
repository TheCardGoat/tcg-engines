import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  createMockItem,
} from ".";
const source = createMockCharacter({
  id: "support-lki-source",
  name: "Support Source",
  cost: 1,
  strength: 1,
  lore: 2,
  abilities: [{ type: "keyword", keyword: "Support" }],
});
const boost = createMockAction({
  id: "support-lki-boost",
  name: "Boost",
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
describe("Support last-known Strength", () => {
  for (const effectType of ["banish", "return-to-hand"] as const) {
    it(`retained Support uses boosted last-known Strength after source ${effectType}`, () => {
      const observer = createMockItem({
        id: `louie-${effectType}`,
        name: "Quest Observer",
        cost: 1,
        abilities: [
          {
            type: "triggered",
            trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
            effect: { type: effectType, target: "CHOSEN_CHARACTER" },
          },
        ],
      });
      const target = createMockCharacter({
        id: "louie-lki-target",
        name: "Target",
        cost: 1,
        strength: 1,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [boost], play: [{ card: source, isDrying: false }, observer, target], deck: 4 },
        { deck: 4 },
      );
      expect(g.asPlayerOne().playCard(boost, { targets: [source] })).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(source)).toBe(3);
      expect(g.asPlayerOne().quest(source)).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getBagCount()).toBe(2);
      expect(
        g.asPlayerOne().resolvePendingByCard(observer, { targets: [source] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(source)).toBe(
        effectType === "banish" ? "discard" : "hand",
      );
      expect(
        g.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true, targets: [target] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(target)).toBe(4);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardStrength(target)).toBe(1);
    });
  }
});

it("retained Support uses the old object after its source returns to play", () => {
  const returner = createMockItem({
    id: "support-returner",
    name: "Returner",
    cost: 0,
    abilities: [
      {
        type: "triggered",
        trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
        effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" },
      },
    ],
  });
  const player = createMockItem({
    id: "support-player",
    name: "Player",
    cost: 0,
    abilities: [
      {
        type: "triggered",
        trigger: { event: "quest", on: "YOUR_CHARACTERS", timing: "whenever" },
        effect: { type: "play-card", from: "hand", cardType: "character", cost: "free" },
      },
    ],
  });
  const target = createMockCharacter({
    id: "support-new-object-target",
    name: "Target",
    cost: 1,
    strength: 1,
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [boost], play: [{ card: source, isDrying: false }, returner, player, target] },
    {},
  );
  expect(g.asPlayerOne().playCard(boost, { targets: [source] })).toBeSuccessfulCommand();
  expect(g.asPlayerOne().quest(source)).toBeSuccessfulCommand();
  expect(
    g.asPlayerOne().resolvePendingByCard(returner, { targets: [source] }),
  ).toBeSuccessfulCommand();
  expect(
    g.asPlayerOne().resolvePendingByCard(player, { targets: [source] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(source)).toBe("play");
  expect(g.asPlayerOne().getCardStrength(source)).toBe(1);
  expect(
    g.asPlayerOne().resolvePendingByCard(source, { resolveOptional: true, targets: [target] }),
  ).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardStrength(target)).toBe(4);
});
