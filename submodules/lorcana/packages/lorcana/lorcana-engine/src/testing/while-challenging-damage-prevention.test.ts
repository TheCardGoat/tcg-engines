// CR 4.6.4.5–4.6.9.2: "while challenging" includes the trigger window.
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockAction, createMockCharacter } from "./index";
const protect = createMockAction({
  id: "window-protect",
  name: "Protect",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "grant-ability",
        ability: {
          type: "takes-no-damage-while-challenging",
          text: "Takes no damage while challenging.",
        },
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
});
const damage = createMockAction({
  id: "window-damage",
  name: "Damage",
  cost: 0,
  abilities: [
    { type: "action", effect: { type: "deal-damage", amount: 1, target: "CHOSEN_CHARACTER" } },
  ],
});
const attacker = createMockCharacter({
  id: "window-attacker",
  name: "Attacker",
  cost: 1,
  strength: 2,
  willpower: 9,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "challenge", on: "SELF", timing: "whenever" },
      effect: { type: "deal-damage", amount: 1, target: "SELF" },
    },
  ],
});
const defender = createMockCharacter({
  id: "window-defender",
  name: "Defender",
  cost: 1,
  strength: 3,
  willpower: 9,
});
describe("while-challenging damage prevention", () => {
  it("prevents trigger and combat damage, but not damage outside the challenge", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [protect, damage], play: [{ card: attacker, isDrying: false }] },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(protect, { targets: [attacker] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(damage, { targets: [attacker] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(attacker)).toBe(1);
    expect(g.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(attacker)).toBe(1);
    expect(g.asPlayerTwo().getDamage(defender)).toBe(2);
  });
  it("does not protect the defender even when the grant is active", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [protect], play: [{ card: attacker, isDrying: false }] },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(protect, { targets: [defender] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(defender)).toBe(2);
    expect(g.asPlayerOne().getDamage(attacker)).toBe(4);
  });
  it("expires before the next own challenge", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [protect], play: [{ card: attacker, isDrying: false }] },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(g.asPlayerOne().playCard(protect, { targets: [attacker] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().quest(defender)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(attacker)).toBe(4);
  });
});
