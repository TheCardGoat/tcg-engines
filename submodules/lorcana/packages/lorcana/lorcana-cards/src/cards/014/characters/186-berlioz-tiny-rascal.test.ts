import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { ward, resist } from "../../../helpers/abilities";
import { berliozTinyRascal } from "./186-berlioz-tiny-rascal";

const victim = createMockCharacter({
  id: "berlioz-victim",
  name: "Victim",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Berlioz - Tiny Rascal", () => {
  it("deals 1 damage to a chosen character when the ability is accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [berliozTinyRascal],
        inkwell: berliozTinyRascal.cost,
        deck: 1,
      },
      {
        play: [victim],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(berliozTinyRascal, {
        resolveOptional: true,
        targets: [victim],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: victim, value: 1 });
  });

  it("dealing the damage can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [berliozTinyRascal],
        inkwell: berliozTinyRascal.cost,
        deck: 1,
      },
      {
        play: [victim],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(berliozTinyRascal, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: victim, value: 0 });
  });

  it("can damage a friendly character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [berliozTinyRascal],
      play: [victim],
      inkwell: 1,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: victim, value: 1 });
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
  });

  it("can choose itself and is banished by its own one damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [berliozTinyRascal],
      inkwell: 1,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(berliozTinyRascal, {
        resolveOptional: true,
        targets: [berliozTinyRascal],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(berliozTinyRascal)).toBe("discard");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("banishes a damaged target at its willpower boundary", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [berliozTinyRascal], inkwell: 1, deck: 3 },
      { play: [{ card: victim, damage: 3 }], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(victim)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(berliozTinyRascal)).toBe("play");
  });

  it("rejects a location and permits retry with a character", () => {
    const location = createMockLocation({
      id: "berlioz-location",
      name: "Location",
      cost: 1,
      willpower: 4,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [berliozTinyRascal], inkwell: 1, deck: 3 },
      { play: [victim, location], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [location] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(location)).toBe(0);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo()).toHaveDamage({ card: victim, value: 1 });
  });

  it("player two owns the choice and deals only one damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [victim], deck: 3 },
      { hand: [berliozTinyRascal], inkwell: 1, deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [victim] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: victim, value: 0 });
    expect(
      g
        .asPlayerTwo()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [victim] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne()).toHaveDamage({ card: victim, value: 1 });
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("opposing Ward blocks selection while friendly Ward is legal", () => {
    const shield = createMockCharacter({
      id: "berlioz-ward",
      name: "Ward target",
      cost: 1,
      willpower: 3,
      abilities: [ward],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [berliozTinyRascal], play: [shield], inkwell: 1, deck: 3 },
      { play: [shield], deck: 3 },
    );
    const enemy = g.findCardInstanceId(shield, "play", "player_two");
    const ally = g.findCardInstanceId(shield, "play", "player_one");
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [enemy] }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(enemy)).toBe(0);
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [ally] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getDamage(ally)).toBe(1);
  });

  it("Resist one prevents the one damage but remains a legal target", () => {
    const shield = createMockCharacter({
      id: "berlioz-resist",
      name: "Resist target",
      cost: 1,
      willpower: 3,
      abilities: [resist(1)],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [berliozTinyRascal], inkwell: 1, deck: 3 },
      { play: [shield], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g
        .asPlayerOne()
        .resolvePendingByCard(berliozTinyRascal, { resolveOptional: true, targets: [shield] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getDamage(shield)).toBe(0);
    expect(g.asPlayerTwo().getCardZone(shield)).toBe("play");
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("cannot quest while fresh then quests without repeating entry damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [berliozTinyRascal], inkwell: 1, deck: 3 },
      { play: [victim], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(berliozTinyRascal, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(0);
    expect(g.asPlayerOne().quest(berliozTinyRascal)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().quest(berliozTinyRascal)).toBeSuccessfulCommand();
    expect(g.getLore("player_one")).toBe(1);
    expect(g.asPlayerTwo().getDamage(victim)).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("unpaid play rejects and inking does not trigger damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [berliozTinyRascal], inkwell: 0, deck: 3 },
      { play: [victim], deck: 3 },
    );
    expect(g.asPlayerOne().playCard(berliozTinyRascal)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(berliozTinyRascal)).toBe("hand");
    expect(g.asPlayerOne().putIntoInkwell("player_one", berliozTinyRascal)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk("player_one")).toBe(1);
    expect(g.asPlayerTwo().getDamage(victim)).toBe(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });
});
