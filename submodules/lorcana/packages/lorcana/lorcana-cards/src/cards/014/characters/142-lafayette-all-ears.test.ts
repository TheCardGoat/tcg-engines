import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { evasive } from "../../../helpers/abilities/evasive";
import { lafayetteAllEars } from "./142-lafayette-all-ears";

describe("Lafayette - All Ears", () => {
  it("has Alert", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [lafayetteAllEars],
      inkwell: lafayetteAllEars.cost,
    });

    expect(testEngine.asPlayerOne().playCard(lafayetteAllEars)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: lafayetteAllEars, keyword: "Alert" });
  });
  it("Alert permits challenging an exerted Evasive character", () => {
    const defender = createMockCharacter({
      id: "lafayette-defender",
      name: "Defender",
      cost: 1,
      willpower: 10,
      abilities: [evasive],
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lafayetteAllEars, isDrying: false }],
        deck: [],
      },
      { play: [{ card: defender, exerted: true }] },
    );
    expect(testEngine.asPlayerOne().challenge(lafayetteAllEars, defender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(lafayetteAllEars.strength);
  });
  it("Alert does not permit challenging a ready Evasive character", () => {
    const defender = createMockCharacter({
      id: "lafayette-ready",
      name: "Defender",
      cost: 1,
      abilities: [evasive],
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lafayetteAllEars, isDrying: false }],
        deck: [],
      },
      { play: [defender] },
    );
    expect(
      testEngine.asPlayerOne().challenge(lafayetteAllEars, defender),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(lafayetteAllEars)).toBe(false);
  });
});

it("Alert does not bypass drying after a paid play", () => {
  const defender = createMockCharacter({
    id: "lafayette-drying-defender",
    name: "Evasive Defender",
    cost: 1,
    willpower: 6,
    abilities: [evasive],
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [lafayetteAllEars], inkwell: 2, deck: 6 },
    { play: [{ card: defender, exerted: true, isDrying: false }], deck: 6 },
  );
  const p = g.asPlayerOne();
  expect(p.playCard(lafayetteAllEars)).toBeSuccessfulCommand();
  expect(p).toHaveKeyword({ card: lafayetteAllEars, keyword: "Alert" });
  expect(p.challenge(lafayetteAllEars, defender)).not.toBeSuccessfulCommand();
  expect(p.quest(lafayetteAllEars)).not.toBeSuccessfulCommand();
  expect(p.isExerted(lafayetteAllEars)).toBe(false);
  expect(g.asPlayerTwo().getDamage(defender)).toBe(0);
});

it("Alert persists across turns and does not protect an exerted Lafayette from a plain attacker", () => {
  const plain = createMockCharacter({
    id: "lafayette-plain-attacker",
    name: "Plain Attacker",
    cost: 1,
    strength: 2,
    willpower: 6,
  });
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: lafayetteAllEars, isDrying: false }], deck: 6 },
    { play: [{ card: plain, isDrying: false }], deck: 6 },
  );
  expect(g.asPlayerOne().quest(lafayetteAllEars)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerOne()).toHaveKeyword({ card: lafayetteAllEars, keyword: "Alert" });
  expect(g.asPlayerOne()).not.toHaveKeyword({ card: lafayetteAllEars, keyword: "Evasive" });
  expect(g.asPlayerTwo().challenge(plain, lafayetteAllEars)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getDamage(lafayetteAllEars)).toBe(2);
  expect(g.asPlayerTwo().getDamage(plain)).toBe(1);
});

it("inks Lafayette without putting Alert into play", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [lafayetteAllEars],
    inkwell: 2,
    deck: 6,
  });
  expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, lafayetteAllEars)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().getCardZone(lafayetteAllEars)).toBe("inkwell");
  expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(g.asPlayerOne().getZonesCardCount().play).toBe(0);
  expect(g.asPlayerOne().getBagCount()).toBe(0);
});

it("a paid Lafayette dries naturally and can quest next own turn", () => {
  const g = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [lafayetteAllEars], inkwell: 2, deck: 6 },
    { deck: 6 },
  );
  expect(g.asPlayerOne().playCard(lafayetteAllEars)).toBeSuccessfulCommand();
  expect(g.asPlayerOne().quest(lafayetteAllEars)).not.toBeSuccessfulCommand();
  expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(g.asPlayerOne()).toHaveKeyword({ card: lafayetteAllEars, keyword: "Alert" });
  expect(g.asPlayerOne().quest(lafayetteAllEars)).toBeSuccessfulCommand();
  expect(g.getLore(PLAYER_ONE)).toBe(1);
  expect(g.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
});
