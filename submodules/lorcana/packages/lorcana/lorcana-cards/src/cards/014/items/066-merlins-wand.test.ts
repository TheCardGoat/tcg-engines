import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { merlinsWand } from "./066-merlins-wand";

const twinA = createMockCharacter({ id: "wand-twin-a", name: "Twin Scholar", cost: 3 });
const twinB = createMockCharacter({ id: "wand-twin-b", name: "Twin Scholar", cost: 3 });

describe("Merlin's Wand", () => {
  it("exerting and revealing 2 same-name hand cards discounts the next play of that name by 1 {I}", () => {
    // Without the discount twinA would cost 3 — only 2 ready ink makes the
    // discounted play the only legal one.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [twinA, twinB],
      inkwell: 2,
      play: [merlinsWand],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(merlinsWand, {
        costs: { revealCards: [twinA, twinB] },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(twinA)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(twinA)).toBe("play");
  });

  it("the discount is single-use: the second twin costs full price", () => {
    // Four ink pays for one discounted twin, but cannot pay full price for the second.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [twinA, twinB],
      inkwell: 4,
      play: [merlinsWand],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(merlinsWand, {
        costs: { revealCards: [twinA, twinB] },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(twinA)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(twinB)).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(twinB)).toBe("hand");
  });
  it("rejects different names before exerting the Wand", () => {
    const different = createMockCharacter({ id: "wand-other", name: "Different Scholar", cost: 3 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [twinA, different],
      play: [merlinsWand],
      inkwell: 2,
    });
    expect(
      engine
        .asPlayerOne()
        .activateAbility(merlinsWand, { costs: { revealCards: [twinA, different] } }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(merlinsWand)).toBe(false);
    expect(engine.asPlayerOne().getCardZone(twinA)).toBe("hand");
    expect(engine.asPlayerOne().playCard(twinA)).not.toBeSuccessfulCommand();
  });

  it("rejects only one revealed card before exerting the Wand", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [twinA],
      play: [merlinsWand],
      inkwell: 2,
    });
    expect(
      engine.asPlayerOne().activateAbility(merlinsWand, { costs: { revealCards: [twinA] } }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(merlinsWand)).toBe(false);
    expect(engine.asPlayerOne().playCard(twinA)).not.toBeSuccessfulCommand();
  });

  it("keeps its discount when another card name is played first", () => {
    const other = createMockCharacter({ id: "wand-first-other", name: "Other", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [twinA, twinB, other],
      play: [merlinsWand],
      inkwell: 3,
    });
    expect(
      engine.asPlayerOne().activateAbility(merlinsWand, { costs: { revealCards: [twinA, twinB] } }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(merlinsWand)).toBe(true);
    expect(engine.asPlayerOne().playCard(other)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(twinA)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(twinB)).toBe("hand");
  });

  it("expires an unused reduction at end of turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [twinA, twinB], play: [merlinsWand], inkwell: 2, deck: [twinA, twinB] },
      { deck: [twinA, twinB] },
    );
    expect(
      engine.asPlayerOne().activateAbility(merlinsWand, { costs: { revealCards: [twinA, twinB] } }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(twinA)).not.toBeSuccessfulCommand();
  });
  it("can activate immediately after being played and cannot pay its exert cost twice", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [merlinsWand, twinA, twinB],
      inkwell: 4,
    });
    expect(engine.asPlayerOne().playCard(merlinsWand)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().activateAbility(merlinsWand, { costs: { revealCards: [twinA, twinB] } }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(merlinsWand)).toBe(true);
    expect(
      engine.asPlayerOne().activateAbility(merlinsWand, { costs: { revealCards: [twinA, twinB] } }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(twinA)).toBeSuccessfulCommand();
  });

  it("allows a same-name item and character pair and discounts the next item with that name", () => {
    const namedItem = createMockItem({ id: "wand-named-item", name: "Twin Scholar", cost: 3 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [twinA, namedItem],
      play: [merlinsWand],
      inkwell: 2,
    });
    expect(
      engine
        .asPlayerOne()
        .activateAbility(merlinsWand, { costs: { revealCards: [twinA, namedItem] } }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(namedItem)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(namedItem)).toBe("play");
    expect(engine.asPlayerOne().getCardZone(twinA)).toBe("hand");
  });
  it("player two must reveal their own pair and receives only one matching discount", () => {
    const opposingTwin = createMockCharacter({
      id: "wand-opposing-twin",
      name: "Twin Scholar",
      cost: 3,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [opposingTwin], inkwell: 2, deck: 6 },
      { hand: [twinA, twinB], play: [merlinsWand], inkwell: 4, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().activateAbility(merlinsWand, {
        costs: { revealCards: [twinA, opposingTwin] },
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.isExerted(merlinsWand)).toBe(false);
    expect(
      game.asPlayerTwo().activateAbility(merlinsWand, {
        costs: { revealCards: [twinA, twinB] },
      }),
    ).toBeSuccessfulCommand();
    expect(game.isExerted(merlinsWand)).toBe(true);
    expect(game.asPlayerTwo().playCard(twinA)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().playCard(twinB)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(twinB)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(opposingTwin)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(twinA)).toBe("play");
  });
});

it("Player Two reveals different versions with the same name and retains the reduction through a different-name play", () => {
  const first = createMockCharacter({
    id: "wand-p2-version-first",
    name: "Twin Scholar",
    version: "Student",
    cost: 3,
  });
  const second = createMockCharacter({
    id: "wand-p2-version-second",
    name: "Twin Scholar",
    version: "Teacher",
    cost: 4,
  });
  const other = createMockCharacter({ id: "wand-p2-other-name", name: "Other", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [twinA], deck: 6 },
    { hand: [merlinsWand, first, second, other], inkwell: 5, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(merlinsWand)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().activateAbility(merlinsWand, { costs: { revealCards: [first, second] } }),
  ).toBeSuccessfulCommand();
  expect(game.isExerted(merlinsWand)).toBe(true);
  expect(
    game.asPlayerTwo().activateAbility(merlinsWand, { costs: { revealCards: [first, second] } }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(other)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().playCard(first)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getCardZone(second)).toBe("hand");
  expect(game.asPlayerOne().getCardZone(twinA)).toBe("hand");
});
it("Player Two unused matching discount expires before their next own turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { play: [merlinsWand], hand: [twinA, twinB], inkwell: 2, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().activateAbility(merlinsWand, { costs: { revealCards: [twinA, twinB] } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.isExerted(merlinsWand)).toBe(false);
  expect(game.asPlayerTwo().playCard(twinA)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().getCardZone(twinA)).toBe("hand");
});
for (const invalid of ["duplicate", "too-many"]) {
  it(`Player Two rejects ${invalid} reveal cost without exerting or granting a reduction`, () => {
    const third = createMockCharacter({ id: "wand-third-invalid", name: "Twin Scholar", cost: 3 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6 },
      { play: [merlinsWand], hand: [twinA, twinB, third], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().activateAbility(merlinsWand, {
        costs: { revealCards: invalid === "duplicate" ? [twinA, twinA] : [twinA, twinB, third] },
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.isExerted(merlinsWand)).toBe(false);
    expect(game.asPlayerTwo().playCard(twinA)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(twinA)).toBe("hand");
  });
}

it("Player Two may spend the named reduction on an unrevealed same-name card of another type", () => {
  const third = createMockItem({ id: "wand-p2-unrevealed-item", name: "Twin Scholar", cost: 3 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { play: [merlinsWand], hand: [twinA, twinB, third], inkwell: 2, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().activateAbility(merlinsWand, { costs: { revealCards: [twinA, twinB] } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(third)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(third)).toBe("play");
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getCardZone(twinA)).toBe("hand");
  expect(game.asPlayerTwo().getCardZone(twinB)).toBe("hand");
});
