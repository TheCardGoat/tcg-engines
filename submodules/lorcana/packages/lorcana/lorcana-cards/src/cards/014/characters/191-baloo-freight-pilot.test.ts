import { berliozTinyRascal } from "./186-berlioz-tiny-rascal";
import { fireTheCannons } from "../../001/actions/197-fire-the-cannons";
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { balooFreightPilot } from "./191-baloo-freight-pilot";

const threeStrengthAttacker = createMockCharacter({
  id: "baloo-attacker-3s",
  name: "Three Strength Attacker",
  cost: 3,
  strength: 3,
  willpower: 9,
});

const fourStrengthAttacker = createMockCharacter({
  id: "baloo-attacker-4s",
  name: "Four Strength Attacker",
  cost: 3,
  strength: 4,
  willpower: 9,
});

describe("Baloo - Freight Pilot", () => {
  it("reduces challenge damage taken by 1 (Resist +1)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: balooFreightPilot, exerted: true }],
      },
      { play: [threeStrengthAttacker] },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(threeStrengthAttacker, balooFreightPilot),
    ).toBeSuccessfulCommand();

    // 3 damage dealt, reduced to 2 by Resist +1.
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: balooFreightPilot, value: 2 });
    expect(testEngine.asPlayerOne().getCardZone(balooFreightPilot)).toBe("play");
  });

  it("survives a challenge dealing damage equal to his willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: balooFreightPilot, exerted: true }],
      },
      { play: [fourStrengthAttacker] },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(fourStrengthAttacker, balooFreightPilot),
    ).toBeSuccessfulCommand();

    // Without Resist the 4 damage would banish the 4-willpower Baloo;
    // Resist +1 reduces it to 3 so he survives.
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: balooFreightPilot, value: 3 });
    expect(testEngine.asPlayerOne().getCardZone(balooFreightPilot)).toBe("play");
  });
});

describe("Baloo Freight Pilot Resist boundaries", () => {
  it("fully prevents one damage from a friendly entry ability", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: balooFreightPilot, isDrying: false }],
      hand: [berliozTinyRascal],
      inkwell: 1,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(berliozTinyRascal, {
        resolveOptional: true,
        targets: [balooFreightPilot],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(balooFreightPilot)).toBe(0);
    expect(game.asPlayerOne().getCardZone(balooFreightPilot)).toBe("play");
  });

  it("reduces each two-damage action separately while preserving existing damage", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: balooFreightPilot, isDrying: false, damage: 1 }],
      hand: [fireTheCannons, fireTheCannons],
      inkwell: 2,
      deck: 3,
    });
    expect(
      game.asPlayerOne().playCard(fireTheCannons, { targets: [balooFreightPilot] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(balooFreightPilot)).toBe(2);
    expect(
      game.asPlayerOne().playCard(fireTheCannons, { targets: [balooFreightPilot] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(balooFreightPilot)).toBe(3);
    expect(game.asPlayerOne().getCardZone(balooFreightPilot)).toBe("play");
  });

  it("reduces incoming damage while attacking without reducing its own five strength", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: balooFreightPilot, isDrying: false }], deck: 3 },
      { play: [{ card: fourStrengthAttacker, exerted: true }], deck: 3 },
    );
    expect(
      game.asPlayerOne().challenge(balooFreightPilot, fourStrengthAttacker),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(balooFreightPilot)).toBe(3);
    expect(game.asPlayerTwo().getDamage(fourStrengthAttacker)).toBe(5);
    expect(game.asPlayerOne().isExerted(balooFreightPilot)).toBe(true);
  });

  it("banishes at four accumulated damage after another reduced action", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: balooFreightPilot, damage: 3, isDrying: false }],
      hand: [fireTheCannons],
      inkwell: 1,
      deck: 3,
    });
    expect(
      game.asPlayerOne().playCard(fireTheCannons, { targets: [balooFreightPilot] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(balooFreightPilot)).toBe("discard");
  });
});

it("Baloo Freight Pilot rejects unpaid play and inks normally", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [balooFreightPilot],
    inkwell: 3,
    deck: 3,
  });
  expect(game.asPlayerOne().playCard(balooFreightPilot)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(balooFreightPilot)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(3);
  expect(
    game.asPlayerOne().putIntoInkwell("player_one", balooFreightPilot),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(4);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
});

it("Baloo Freight Pilot pays four ink and quests for one only after drying", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [balooFreightPilot], inkwell: 4, deck: 3 },
    { play: [{ card: fourStrengthAttacker, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(balooFreightPilot)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(0);
  expect(game.asPlayerOne().quest(balooFreightPilot)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().challenge(balooFreightPilot, fourStrengthAttacker),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(balooFreightPilot)).toBe(false);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(balooFreightPilot)).toBeSuccessfulCommand();
  expect(game.getLore("player_one")).toBe(1);
});
