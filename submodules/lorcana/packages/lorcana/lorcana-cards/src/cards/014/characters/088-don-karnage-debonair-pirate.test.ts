import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { healingGlow } from "../../001/actions/028-healing-glow";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { donKarnageKhansCourier } from "./070-don-karnage-khans-courier";
import { resist } from "../../../helpers/abilities/resist";
import { donKarnageDebonairPirate } from "./088-don-karnage-debonair-pirate";

const plainOpponent = createMockCharacter({
  id: "karnage-plain-opponent",
  name: "Plain Opponent",
  cost: 2,
  strength: 2,
  willpower: 4,
});

const resistingOpponent = createMockCharacter({
  id: "karnage-resisting-opponent",
  name: "Resisting Opponent",
  cost: 3,
  strength: 2,
  willpower: 4,
  abilities: [resist(1)],
});

describe("Don Karnage - Debonair Pirate", () => {
  it("Lasting Impression deals 1 damage to each opposing character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donKarnageDebonairPirate],
        inkwell: donKarnageDebonairPirate.cost,
        deck: 6,
      },
      {
        play: [
          { card: plainOpponent, isDrying: false },
          { card: resistingOpponent, isDrying: false },
        ],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(donKarnageDebonairPirate)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: plainOpponent, value: 1 });
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: resistingOpponent, value: 1 });
  });

  it("Lasting Impression damage ignores Resist", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donKarnageDebonairPirate],
        inkwell: donKarnageDebonairPirate.cost,
        deck: 6,
      },
      {
        play: [{ card: resistingOpponent, isDrying: false }],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(donKarnageDebonairPirate)).toBeSuccessfulCommand();

    // Resist +1 would reduce 1 damage to 0; the damage can't be reduced.
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: resistingOpponent, value: 1 });
  });

  it("So Suave gives each opposing damaged character -1 {L} while exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [donKarnageDebonairPirate],
        deck: 6,
      },
      {
        play: [
          { card: plainOpponent, isDrying: false, damage: 1 },
          { card: resistingOpponent, isDrying: false },
        ],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().quest(donKarnageDebonairPirate)).toBeSuccessfulCommand();

    expect(testEngine.getCard(plainOpponent).lore).toBe(0);
    expect(testEngine.getCard(resistingOpponent).lore).toBe(1);
  });

  it("So Suave does nothing while ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [donKarnageDebonairPirate],
        deck: 6,
      },
      {
        play: [{ card: plainOpponent, isDrying: false, damage: 1 }],
        deck: 6,
      },
    );

    expect(testEngine.getCard(plainOpponent).lore).toBe(1);
  });
});

it("damages Ward, ignores large Resist and banishes lethal targets without damaging your characters", () => {
  const armored = createMockCharacter({
    id: "karnage-armor",
    name: "Armored",
    cost: 1,
    strength: 1,
    willpower: 5,
    abilities: [resist(5)],
  });
  const fragile = createMockCharacter({
    id: "karnage-fragile",
    name: "Fragile",
    cost: 1,
    strength: 1,
    willpower: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [donKarnageDebonairPirate], play: [plainOpponent], inkwell: 6, deck: 6 },
    { play: [aladdinPrinceAli, armored, fragile], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(donKarnageDebonairPirate)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: aladdinPrinceAli, value: 1 });
  expect(game.asPlayerTwo()).toHaveDamage({ card: armored, value: 1 });
  expect(game.asPlayerTwo().getCardZone(fragile)).toBe("discard");
  expect(game.asPlayerOne()).toHaveDamage({ card: plainOpponent, value: 0 });
});
it("can play with no opposing characters and cannot pay with insufficient ink", () => {
  for (const ink of [5, 6]) {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donKarnageDebonairPirate],
      inkwell: ink,
      deck: 6,
    });
    const result = game.asPlayerOne().playCard(donKarnageDebonairPirate);
    if (ink === 5) {
      expect(result).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
    } else {
      expect(result).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().getBagCount()).toBe(0);
    }
  }
});
it("Shift pays four, inherits exertion and damage, and triggers one damage", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [donKarnageDebonairPirate],
      play: [{ card: donKarnageKhansCourier, exerted: true, damage: 1 }],
      inkwell: 4,
      deck: 6,
    },
    { play: [resistingOpponent], deck: 6 },
  );
  const shiftTarget = game.findCardInstanceId(donKarnageKhansCourier, "play", PLAYER_ONE);
  expect(
    game.asPlayerOne().playCard(donKarnageDebonairPirate, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().isExerted(donKarnageDebonairPirate)).toBe(true);
  expect(game.asPlayerOne()).toHaveDamage({ card: donKarnageDebonairPirate, value: 1 });
  expect(game.asPlayerTwo()).toHaveDamage({ card: resistingOpponent, value: 1 });
  expect(game.getCard(resistingOpponent).lore).toBe(0);
});
it("rejects Shift onto another name or an opposing Don before paying", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [donKarnageDebonairPirate], play: [plainOpponent], inkwell: 4, deck: 6 },
    { play: [donKarnageKhansCourier], deck: 6 },
  );
  for (const shiftTarget of [
    game.findCardInstanceId(plainOpponent, "play", PLAYER_ONE),
    game.findCardInstanceId(donKarnageKhansCourier, "play", PLAYER_TWO),
  ]) {
    expect(
      game
        .asPlayerOne()
        .playCard(donKarnageDebonairPirate, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
  }
});
it("uses reduced lore for quests and restores it after healing and your ready step", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [donKarnageDebonairPirate], deck: 6 },
    {
      play: [
        { card: plainOpponent, damage: 1 },
        { card: resistingOpponent, damage: 1 },
      ],
      hand: [healingGlow],
      inkwell: 1,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().quest(donKarnageDebonairPirate)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(plainOpponent)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(0);
  expect(
    game.asPlayerTwo().playCard(healingGlow, { targets: [resistingOpponent] }),
  ).toBeSuccessfulCommand();
  expect(game.getCard(resistingOpponent).lore).toBe(1);
  expect(game.asPlayerTwo().quest(resistingOpponent)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(1);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getCard(plainOpponent).lore).toBe(1);
  expect(game.getLore(PLAYER_ONE)).toBe(2);
});
it("two exerted sources stack and leaving play removes only that source", () => {
  const target = createMockCharacter({
    id: "karnage-three-lore",
    name: "High Lore",
    cost: 1,
    lore: 3,
    willpower: 4,
    strength: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [donKarnageDebonairPirate, donKarnageDebonairPirate],
      hand: [dragonFire],
      inkwell: 5,
      deck: 6,
    },
    { play: [{ card: target, damage: 1 }], deck: 6 },
  );
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
  for (const [index, copy] of copies.entries()) {
    expect(game.asPlayerOne().quest(copy)).toBeSuccessfulCommand();
    expect(game.getCard(target).lore).toBe(2 - index);
  }
  expect(
    game.asPlayerOne().playCard(dragonFire, { targets: [copies[0]!] }),
  ).toBeSuccessfulCommand();
  expect(game.getCard(target).lore).toBe(2);
});
it("So Suave excludes own characters and negative lore yields zero when questing", () => {
  const zero = createMockCharacter({
    id: "karnage-zero-lore",
    name: "Zero Lore",
    cost: 1,
    lore: 0,
    willpower: 4,
    strength: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [donKarnageDebonairPirate, { card: plainOpponent, damage: 1 }], deck: 6 },
    { play: [{ card: zero, damage: 1 }], deck: 6 },
  );
  expect(game.asPlayerOne().quest(donKarnageDebonairPirate)).toBeSuccessfulCommand();
  expect(game.getCard(plainOpponent).lore).toBe(1);
  // CR 6.6.3: retain the negative value for modifiers; count it as zero for questing.
  expect(game.getCard(zero).lore).toBe(-1);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(zero)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(0);
});

it("player two's exerted Shift damages Ward and Resist opponents and reduces only opposing lore", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [resistingOpponent, aladdinPrinceAli], deck: 6 },
    {
      hand: [donKarnageDebonairPirate],
      play: [
        { card: donKarnageKhansCourier, exerted: true, damage: 1 },
        { card: plainOpponent, damage: 1 },
      ],
      inkwell: 4,
      deck: 6,
    },
  );
  // Begin player two's turn before exerting the Shift base through a public quest.
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(donKarnageKhansCourier)).toBeSuccessfulCommand();
  const shiftTarget = game.findCardInstanceId(donKarnageKhansCourier, "play", PLAYER_TWO)!;
  expect(
    game.asPlayerTwo().playCard(donKarnageDebonairPirate, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().isExerted(donKarnageDebonairPirate)).toBe(true);
  expect(game.asPlayerTwo()).toHaveDamage({ card: donKarnageDebonairPirate, value: 1 });
  expect(game.asPlayerOne()).toHaveDamage({ card: resistingOpponent, value: 1 });
  expect(game.asPlayerOne()).toHaveDamage({ card: aladdinPrinceAli, value: 1 });
  expect(game.asPlayerTwo()).toHaveDamage({ card: plainOpponent, value: 1 });
  expect(game.getCard(resistingOpponent).lore).toBe(0);
  expect(game.getCard(plainOpponent).lore).toBe(1);
});

it("Player Two's exact sources restore quest lore independently when removed", () => {
  const target = createMockCharacter({
    id: "don-removal-high-lore",
    name: "High Lore",
    cost: 1,
    lore: 3,
    willpower: 4,
    strength: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: target, damage: 1 },
        { card: target, damage: 1 },
        { card: target, damage: 1 },
        target,
      ],
      hand: [dragonFire, dragonFire],
      inkwell: 10,
      deck: 6,
    },
    {
      play: [
        donKarnageDebonairPirate,
        donKarnageDebonairPirate,
        { card: plainOpponent, damage: 1 },
      ],
      deck: 6,
    },
  );
  const sources = game.getCardInstanceIdsInZone("play", PLAYER_TWO).slice(0, 2);
  const targets = game.getCardInstanceIdsInZone("play", PLAYER_ONE);
  const removals = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const source of sources) expect(game.asPlayerTwo().quest(source)).toBeSuccessfulCommand();
  expect(game.getCard(plainOpponent).lore).toBe(1);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(targets[0]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().quest(targets[3]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(4);
  expect(
    game.asPlayerOne().playCard(removals[0]!, { targets: [sources[0]!] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(sources[0]!)).toBe("discard");
  expect(game.getCard(targets[1]!).lore).toBe(2);
  expect(game.asPlayerOne().quest(targets[1]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(6);
  expect(
    game.asPlayerOne().playCard(removals[1]!, { targets: [sources[1]!] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(sources[1]!)).toBe("discard");
  expect(game.getCard(targets[2]!).lore).toBe(3);
  expect(game.asPlayerOne().quest(targets[2]!)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(9);
  expect(game.getLore(PLAYER_TWO)).toBe(4);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
});
