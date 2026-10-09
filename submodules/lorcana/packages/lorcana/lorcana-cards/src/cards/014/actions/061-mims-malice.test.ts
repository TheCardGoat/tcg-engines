import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { mimsMalice } from "./061-mims-malice";

const myWounded = createMockCharacter({
  id: "mims-malice-wounded",
  name: "Wounded Ally",
  cost: 2,
  strength: 2,
  willpower: 6,
});

const enemy = createMockCharacter({
  id: "mims-malice-enemy",
  name: "Enemy Victim",
  cost: 3,
  strength: 3,
  willpower: 6,
});

describe("Mim's Malice", () => {
  it("moves up to 3 damage from a chosen character of yours to a chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mimsMalice],
        inkwell: mimsMalice.cost,
        play: [{ card: myWounded, damage: 3 }],
      },
      {
        play: [enemy],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(mimsMalice, { targets: [myWounded, enemy] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: myWounded, value: 0 });
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: enemy, value: 3 });
  });

  it("moves only the available damage when the source has fewer than three", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mimsMalice],
        inkwell: mimsMalice.cost,
        play: [{ card: myWounded, damage: 2 }],
      },
      {
        play: [enemy],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(mimsMalice, { targets: [myWounded, enemy] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: myWounded, value: 0 });
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: enemy, value: 2 });
  });
  for (const amount of [0, 1, 2, 3]) {
    it(`lets the player choose to move ${amount} of three available damage`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [mimsMalice], inkwell: 2, play: [{ card: myWounded, damage: 3 }] },
        { play: [enemy] },
      );
      expect(
        engine.asPlayerOne().playCard(mimsMalice, {
          targets: { kind: "move-damage", from: [myWounded], to: [enemy] },
          amount,
        }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getDamage(myWounded)).toBe(3 - amount);
      expect(engine.asPlayerTwo().getDamage(enemy)).toBe(amount);
      expect(engine.asPlayerOne().getCardZone(mimsMalice)).toBe("discard");
    });
  }

  it("can move damage from one opposing character to another", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mimsMalice], inkwell: 2 },
      { play: [{ card: myWounded, damage: 4 }, enemy] },
    );
    expect(
      engine
        .asPlayerOne()
        .playCard(mimsMalice, { targets: { kind: "move-damage", from: [myWounded], to: [enemy] } }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getDamage(myWounded)).toBe(1);
    expect(engine.asPlayerTwo().getDamage(enemy)).toBe(3);
  });

  it("cannot move damage to a friendly character or use an item as the source", () => {
    const item = createMockItem({ id: "malice-item", name: "Item", cost: 1 });
    for (const invalidSource of [false, true]) {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [mimsMalice], inkwell: 2, play: [{ card: myWounded, damage: 3 }, item] },
        { play: [enemy] },
      );
      expect(
        engine.asPlayerOne().playCard(mimsMalice, {
          targets: {
            kind: "move-damage",
            from: [invalidSource ? item : myWounded],
            to: [invalidSource ? enemy : myWounded],
          },
        }),
      ).not.toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(mimsMalice)).toBe("hand");
      expect(engine.asPlayerOne().getDamage(myWounded)).toBe(3);
      expect(engine.asPlayerTwo().getDamage(enemy)).toBe(0);
    }
  });

  it("banishes the destination when the moved damage reaches its willpower", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mimsMalice], inkwell: 2, play: [{ card: myWounded, damage: 3 }] },
      { play: [{ card: enemy, damage: 3 }] },
    );
    expect(
      engine.asPlayerOne().playCard(mimsMalice, { targets: [myWounded, enemy] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(myWounded)).toBe(0);
    expect(engine.asPlayerTwo().getCardZone(enemy)).toBe("discard");
  });

  it("resolves without adding damage when the source has none", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mimsMalice], inkwell: 2, play: [myWounded] },
      { play: [enemy] },
    );
    expect(
      engine.asPlayerOne().playCard(mimsMalice, { targets: [myWounded, enemy] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(myWounded)).toBe(0);
    expect(engine.asPlayerTwo().getDamage(enemy)).toBe(0);
  });
  it("player two moves three damage between opposing characters and banishes only the destination", () => {
    const untouched = createMockCharacter({
      id: "malice-untouched",
      cost: 1,
      name: "Untouched",
      willpower: 6,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: myWounded, damage: 4 }, { card: enemy, damage: 3 }, untouched], deck: 6 },
      { hand: [mimsMalice], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(mimsMalice, {
        targets: { kind: "move-damage", from: [myWounded], to: [enemy] },
        amount: 3,
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getDamage(myWounded)).toBe(1);
    expect(game.asPlayerOne().getCardZone(myWounded)).toBe("play");
    expect(game.asPlayerOne().getCardZone(enemy)).toBe("discard");
    expect(game.asPlayerOne().getDamage(untouched)).toBe(0);
    expect(game.asPlayerOne().getCardZone(untouched)).toBe("play");
    expect(game.asPlayerTwo().getCardZone(mimsMalice)).toBe("discard");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  });
});

for (const amount of [0, 1, 2]) {
  it(`Player Two chooses ${amount} of two damage without changing unrelated characters`, () => {
    const item = createMockItem({ id: "malice-p2-item", name: "Item", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [enemy, item], deck: 6 },
      { hand: [mimsMalice], play: [{ card: myWounded, damage: 2 }], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().playCard(mimsMalice, {
        targets: { kind: "move-damage", from: [myWounded], to: [enemy] },
        amount,
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getDamage(myWounded)).toBe(2 - amount);
    expect(game.asPlayerOne().getDamage(enemy)).toBe(amount);
    expect(game.asPlayerOne().getCardZone(enemy)).toBe("play");
    expect(game.asPlayerOne().getCardZone(item)).toBe("play");
    expect(game.asPlayerTwo().getCardZone(mimsMalice)).toBe("discard");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  });
}
it("Player Two resolves an undamaged source without adding destination damage", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: enemy, damage: 2 }], deck: 6 },
    { play: [myWounded], hand: [mimsMalice], inkwell: 2, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .playCard(mimsMalice, { targets: { kind: "move-damage", from: [myWounded], to: [enemy] } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getDamage(myWounded)).toBe(0);
  expect(game.asPlayerOne().getDamage(enemy)).toBe(2);
  expect(game.asPlayerTwo().getCardZone(mimsMalice)).toBe("discard");
});
