// CR 6.4: continuously active resource conditions must update during bag resolution.
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, PLAYER_ONE } from "./index";
const source = createMockCharacter({
  id: "drop-strength-source",
  name: "Drop Strength",
  cost: 1,
  strength: 4,
  willpower: 9,
  abilities: [
    {
      type: "static",
      condition: {
        type: "resource-count",
        what: "ink-drops",
        controller: "you",
        comparison: "greater-or-equal",
        value: 1,
      },
      effect: { type: "modify-stat", stat: "strength", modifier: 2, target: "SELF" },
    },
    {
      type: "triggered",
      trigger: {
        event: "deal-damage",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "in-challenge" }],
      },
      effect: {
        type: "deal-damage",
        amount: { type: "strength-of", target: "SELF" },
        target: "ANOTHER_CHOSEN_CHARACTER",
      },
    },
  ],
});
const reward = createMockCharacter({
  id: "drop-strength-reward",
  name: "Reward",
  cost: 0,
  abilities: [
    {
      type: "triggered",
      trigger: {
        event: "deal-damage",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [{ type: "in-challenge" }],
      },
      effect: { type: "gain-ink-drop", amount: 1, target: "CONTROLLER" },
    },
  ],
});
const defender = createMockCharacter({
  id: "drop-strength-defender",
  name: "Defender",
  cost: 0,
  strength: 1,
  willpower: 9,
});
const bystander = createMockCharacter({
  id: "drop-strength-bystander",
  name: "Bystander",
  cost: 0,
  willpower: 9,
});
describe("ink drop static ability cache", () => {
  it("uses the last known boosted Strength after lethal return damage (CR 6.7.6)", () => {
    const fatal = createMockCharacter({
      id: "fatal-drop-defender",
      name: "Fatal Defender",
      cost: 0,
      strength: 9,
      willpower: 9,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [source], inkDrops: 1 },
      { play: [{ card: fatal, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(source, fatal)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(source)).toBe("discard");
    expect(g.asPlayerOne().getDamage(fatal)).toBe(6);
    expect(
      g.asPlayerOne().resolvePendingByCard(source, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(6);
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
  });
  it("uses newly gained drop Strength when the next bag effect resolves", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [source, reward] },
      { play: [{ card: defender, exerted: true }, bystander] },
    );
    expect(g.asPlayerOne().challenge(source, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(defender)).toBe(4);
    expect(g.asPlayerOne().resolvePendingByCard(reward)).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(source, { targets: [bystander] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(bystander)).toBe(6);
  });
});
