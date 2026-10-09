// CR 2.2.0: 6.6.1.1-6.6.1.2 fixed-duration combined modifiers, 3.2.1.3 next-owner-turn expiry, 8.15.1 Ward.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { priyaMangalImmovableFan } from "./007-priya-mangal-immovable-fan";

const target = createMockCharacter({
  id: "priya-target",
  name: "Target",
  cost: 3,
  strength: 4,
  willpower: 4,
});

describe("Priya Mangal - Immovable Fan", () => {
  it("gives chosen character -2 {S} until the start of your next turn when accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [priyaMangalImmovableFan],
        inkwell: priyaMangalImmovableFan.cost,
        play: [target],
        deck: 3,
      },
      { deck: 3 },
    );

    expect(testEngine.asPlayerOne().playCard(priyaMangalImmovableFan)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: true,
        targets: [target],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(target)).toBe((target.strength ?? 0) - 2);
  });

  it("the -2 {S} expires at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [priyaMangalImmovableFan],
        inkwell: priyaMangalImmovableFan.cost,
        play: [target],
        deck: 3,
      },
      { deck: 3 },
    );

    expect(testEngine.asPlayerOne().playCard(priyaMangalImmovableFan)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: true,
        targets: [target],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(target)).toBe((target.strength ?? 0) - 2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(target)).toBe(2);
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(target)).toBe(target.strength);
  });

  it("does not modify strength when declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [priyaMangalImmovableFan],
        inkwell: priyaMangalImmovableFan.cost,
        play: [target],
        deck: 3,
      },
      { deck: 3 },
    );

    expect(testEngine.asPlayerOne().playCard(priyaMangalImmovableFan)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(target)).toBe(target.strength);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("can reduce an opposing character's strength", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [priyaMangalImmovableFan], inkwell: 2, deck: 3 },
      { play: [target], deck: 3 },
    );
    expect(engine.asPlayerOne().playCard(priyaMangalImmovableFan)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolveOnlyBag({ resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardStrength(target)).toBe(2);
  });

  it("keeps Player Two's reduction through Player One's turn and expires on Player Two's next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [target], deck: 6 },
      { hand: [priyaMangalImmovableFan], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(priyaMangalImmovableFan)).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolveOnlyBag({ resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(target)).toBe(2);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(target)).toBe(2);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardStrength(target)).toBe(4);
  });
});

it("exact Player Two copies combine reductions and retain them after a source leaves", () => {
  const bounce = createMockAction({
    id: "priya-bounce",
    name: "Return Source",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [target], deck: 6 },
    { hand: [priyaMangalImmovableFan, priyaMangalImmovableFan, bounce], inkwell: 4, deck: 6 },
  );
  const copies = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter(
      (id) => game.asServer().getCardDefinitionByInstanceId(id).id === priyaMangalImmovableFan.id,
    );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const [i, copy] of copies.entries()) {
    expect(game.asPlayerTwo().playCard(copy)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copy, { resolveOptional: true, targets: [target] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(
      game.asPlayerTwo().resolvePendingByCard(copy, { resolveOptional: true, targets: [target] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardStrength(target)).toBe(4 - 2 * (i + 1));
  }
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().playCard(bounce, { targets: [copies[0]] })).toBeSuccessfulCommand();
  expect(game.asServer().getCard(copies[0]).zone).toBe("hand");
  expect(game.asPlayerOne().getCardStrength(target)).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardStrength(target)).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardStrength(target)).toBe(4);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});

it("Player Two rejects hidden, item and opposing Ward targets but may choose own Ward and herself", () => {
  const ward = createMockCharacter({
    id: "priya-ward",
    name: "Ward Target",
    cost: 1,
    strength: 4,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const item = createMockItem({ id: "priya-item", name: "Item Target", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [ward], deck: 6 },
    {
      hand: [priyaMangalImmovableFan, priyaMangalImmovableFan, target],
      play: [ward, item],
      inkwell: 4,
      deck: 6,
    },
  );
  const copies = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter(
      (id) => game.asServer().getCardDefinitionByInstanceId(id).id === priyaMangalImmovableFan.id,
    );
  const ownWard = game.findCardInstanceId(ward, "play", PLAYER_TWO);
  const enemyWard = game.getCardInstanceIdsInZone("play", PLAYER_ONE)[0];
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(copies[0])).toBeSuccessfulCommand();
  for (const rejected of [target, item, enemyWard]) {
    expect(
      game
        .asPlayerTwo()
        .resolvePendingByCard(copies[0], { resolveOptional: true, targets: [rejected] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(game.asPlayerTwo().getCardStrength(ownWard)).toBe(4);
    expect(game.asPlayerOne().getCardStrength(enemyWard)).toBe(4);
  }
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(copies[0], { resolveOptional: true, targets: [ownWard] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardStrength(ownWard)).toBe(2);
  expect(game.asPlayerTwo().playCard(copies[1])).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(copies[1], { resolveOptional: true, targets: [copies[1]] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardStrength(copies[1])).toBe(-1);
  expect(game.asPlayerTwo().getCardStrength(copies[0])).toBe(1);
  expect(game.asPlayerOne().getCardStrength(enemyWard)).toBe(4);
  expect(game.asServer().getCard(game.findCardInstanceId(target, "hand", PLAYER_TWO)).zone).toBe(
    "hand",
  );
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardStrength(ownWard)).toBe(4);
  expect(game.asPlayerTwo().getCardStrength(copies[1])).toBe(1);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
