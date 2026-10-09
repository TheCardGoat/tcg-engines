import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { horaceClumsyClod } from "./082-horace-clumsy-clod";

const damagedOpponent = createMockCharacter({
  id: "horace-damaged-opponent",
  name: "Bruised Brute",
  cost: 3,
  strength: 3,
  willpower: 4,
});

const healthyOpponent = createMockCharacter({
  id: "horace-healthy-opponent",
  name: "Pristine Pal",
  cost: 3,
  strength: 3,
  willpower: 4,
});

describe("Horace - Clumsy Clod", () => {
  it("BUNGLED IT deals 1 damage to chosen opposing damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [horaceClumsyClod],
        inkwell: horaceClumsyClod.cost,
        deck: 6,
      },
      {
        play: [
          { card: damagedOpponent, isDrying: false, damage: 1 },
          { card: healthyOpponent, isDrying: false },
        ],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(horaceClumsyClod)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(horaceClumsyClod, {
        targets: [damagedOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: damagedOpponent, value: 2 });
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: healthyOpponent, value: 0 });
  });

  it("BUNGLED IT cannot choose an undamaged opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [horaceClumsyClod],
        inkwell: horaceClumsyClod.cost,
        deck: 6,
      },
      {
        play: [{ card: healthyOpponent, isDrying: false }],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(horaceClumsyClod)).toBeSuccessfulCommand();

    const result = testEngine.asPlayerOne().resolvePendingByCard(horaceClumsyClod, {
      targets: [healthyOpponent],
    });

    expect(result).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: healthyOpponent, value: 0 });
  });

  it("BUNGLED IT banishes a damaged character reduced to 0 willpower", () => {
    const frailOpponent = createMockCharacter({
      id: "horace-frail-opponent",
      name: "Frail Foe",
      cost: 2,
      strength: 1,
      willpower: 2,
    });
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [horaceClumsyClod],
        inkwell: horaceClumsyClod.cost,
        deck: 6,
      },
      {
        play: [{ card: frailOpponent, isDrying: false, damage: 1 }],
        deck: 6,
      },
    );

    expect(testEngine.asPlayerOne().playCard(horaceClumsyClod)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(horaceClumsyClod, {
        targets: [frailOpponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(frailOpponent)).toBe("discard");
  });
});

it("rejects own damaged characters, Ward and two targets before a legal choice", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [horaceClumsyClod], inkwell: 3, play: [{ card: healthyOpponent, damage: 1 }], deck: 6 },
    {
      play: [
        { card: damagedOpponent, damage: 1 },
        { card: aladdinPrinceAli, damage: 1 },
      ],
      deck: 6,
    },
  );
  const player = game.asPlayerOne();
  expect(player.playCard(horaceClumsyClod)).toBeSuccessfulCommand();
  for (const targets of [
    [healthyOpponent],
    [aladdinPrinceAli],
    [damagedOpponent, aladdinPrinceAli],
  ]) {
    expect(player.resolvePendingByCard(horaceClumsyClod, { targets })).not.toBeSuccessfulCommand();
  }
  expect(player).toHaveDamage({ card: healthyOpponent, value: 1 });
  expect(game.asPlayerTwo()).toHaveDamage({ card: damagedOpponent, value: 1 });
  expect(game.asPlayerTwo()).toHaveDamage({ card: aladdinPrinceAli, value: 1 });
  expect(game.asPlayerTwo().getCardZone(aladdinPrinceAli)).toBe("play");
  expect(
    player.resolvePendingByCard(horaceClumsyClod, { targets: [damagedOpponent] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: damagedOpponent, value: 2 });
});
it("cannot damage two otherwise legal opposing characters", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [horaceClumsyClod], inkwell: 3, deck: 6 },
    {
      play: [
        { card: damagedOpponent, damage: 1 },
        { card: healthyOpponent, damage: 1 },
      ],
      deck: 6,
    },
  );
  expect(game.asPlayerOne().playCard(horaceClumsyClod)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(horaceClumsyClod, { targets: [damagedOpponent, healthyOpponent] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: damagedOpponent, value: 1 });
  expect(game.asPlayerTwo()).toHaveDamage({ card: healthyOpponent, value: 1 });
});
it("resolves without damage when no opposing damaged character exists", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [horaceClumsyClod], inkwell: 3, deck: 6 },
    { play: [healthyOpponent], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(horaceClumsyClod)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getCardZone(horaceClumsyClod)).toBe("play");
  expect(game.asPlayerOne().resolvePendingByCard(horaceClumsyClod)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo()).toHaveDamage({ card: healthyOpponent, value: 0 });
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});
it("each copy deals one damage on play; questing does not repeat it", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [horaceClumsyClod, horaceClumsyClod], inkwell: 6, deck: 6 },
    { play: [{ card: damagedOpponent, damage: 1 }], deck: 6 },
  );
  const player = game.asPlayerOne();
  const copies = game.getCardInstanceIdsInZone("hand", "player_one");
  for (const copy of copies) {
    expect(player.playCard(copy)).toBeSuccessfulCommand();
    expect(
      player.resolvePendingByCard(copy, { targets: [damagedOpponent] }),
    ).toBeSuccessfulCommand();
  }
  expect(game.asPlayerTwo()).toHaveDamage({ card: damagedOpponent, value: 3 });
  expect(player.quest(copies[0]!)).not.toBeSuccessfulCommand();
  expect(player.passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(player.quest(copies[0]!)).toBeSuccessfulCommand();
  expect(game.getLore("player_one")).toBe(1);
  expect(game.asPlayerTwo()).toHaveDamage({ card: damagedOpponent, value: 3 });
  expect(player.quest(copies[0]!)).not.toBeSuccessfulCommand();
});

it("player two can damage only the opposing damaged character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: damagedOpponent, damage: 1 },
        healthyOpponent,
        { card: aladdinPrinceAli, damage: 1 },
      ],
      deck: 6,
    },
    {
      hand: [horaceClumsyClod],
      inkwell: 3,
      play: [{ card: horaceClumsyClod, damage: 1 }],
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const source = game.findCardInstanceId(horaceClumsyClod, "hand", "player_two")!;
  const own = game.findCardInstanceId(horaceClumsyClod, "play", "player_two")!;
  expect(game.asPlayerTwo().playCard(source)).toBeSuccessfulCommand();
  for (const target of [own, healthyOpponent, aladdinPrinceAli]) {
    expect(
      game.asPlayerTwo().resolvePendingByCard(source, { targets: [target] }),
    ).not.toBeSuccessfulCommand();
  }
  expect(
    game.asPlayerTwo().resolvePendingByCard(source, { targets: [damagedOpponent] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveDamage({ card: damagedOpponent, value: 2 });
  expect(game.asPlayerTwo().getDamage(own)).toBe(1);
  expect(game.asPlayerOne()).toHaveDamage({ card: healthyOpponent, value: 0 });
  expect(game.asPlayerOne()).toHaveDamage({ card: aladdinPrinceAli, value: 1 });
});
