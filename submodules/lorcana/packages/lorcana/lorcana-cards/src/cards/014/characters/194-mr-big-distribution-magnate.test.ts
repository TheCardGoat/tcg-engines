import { aladdinPrinceAli } from "../../001/characters/069-aladdin-prince-ali";
import { bellesHouseMauricesWorkshop } from "../../003/locations/168-belles-house-maurices-workshop";
import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mrBigDistributionMagnate } from "./194-mr-big-distribution-magnate";

const restrictedEnemy = createMockCharacter({
  id: "big-restricted-enemy",
  name: "Restricted Enemy",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const freeEnemy = createMockCharacter({
  id: "big-free-enemy",
  name: "Free Enemy",
  cost: 3,
  strength: 2,
  willpower: 4,
});

const exertedDefender = createMockCharacter({
  id: "big-exerted-defender",
  name: "Exerted Defender",
  cost: 1,
  strength: 1,
  willpower: 9,
});

describe("Mr. Big - Distribution Magnate", () => {
  it("at end of turn with all ink exerted, chosen opposing character can't challenge until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mrBigDistributionMagnate],
        inkwell: mrBigDistributionMagnate.cost,
        deck: 3,
        play: [{ card: exertedDefender, exerted: true }],
      },
      { play: [restrictedEnemy, freeEnemy] },
    );

    // Paying the full inkwell leaves every ink card exerted.
    expect(testEngine.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // Ice Out fires at end of turn; choose which enemy is frozen out.
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mrBigDistributionMagnate, {
        targets: [restrictedEnemy],
      }),
    ).toBeSuccessfulCommand();

    // The chosen character cannot challenge...
    expect(
      testEngine.asPlayerTwo().challenge(restrictedEnemy, exertedDefender),
    ).not.toBeSuccessfulCommand();
    // ...but the other one still can.
    expect(testEngine.asPlayerTwo().challenge(freeEnemy, exertedDefender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Start of my next turn readies the inkwell, so Ice Out no longer fires;
    // the freeze also expires at the start of my turn. Re-exert my defender
    // (it readied) so it is a legal challenge target again.
    expect(testEngine.asPlayerOne().quest(exertedDefender)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(restrictedEnemy, exertedDefender),
    ).toBeSuccessfulCommand();
  });

  it("does not trigger while a ready ink card remains in the inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mrBigDistributionMagnate],
        inkwell: mrBigDistributionMagnate.cost + 1,
        deck: 3,
        play: [{ card: exertedDefender, exerted: true }],
      },
      { play: [restrictedEnemy] },
    );

    expect(testEngine.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
    // One ready ink remains, so Ice Out does not fire and no target is asked.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(restrictedEnemy, exertedDefender),
    ).toBeSuccessfulCommand();
  });
});

it("Ice Out does not stop the chosen character from questing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [mrBigDistributionMagnate], inkwell: 2, deck: 3 },
    { play: [restrictedEnemy], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(mrBigDistributionMagnate, { targets: [restrictedEnemy] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(restrictedEnemy)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().isExerted(restrictedEnemy)).toBe(true);
});

it("Ice Out blocks Player One when controlled by Player Two", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [restrictedEnemy, freeEnemy], deck: 3 },
    {
      hand: [mrBigDistributionMagnate],
      inkwell: 2,
      play: [{ card: exertedDefender, exerted: true }],
      deck: 3,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(exertedDefender)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(mrBigDistributionMagnate, { targets: [restrictedEnemy] }),
  ).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().challenge(restrictedEnemy, exertedDefender),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(freeEnemy, exertedDefender)).toBeSuccessfulCommand();
});

it("Ice Out rejects a friendly target and keeps its opposing target choice", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [mrBigDistributionMagnate],
      inkwell: 2,
      play: [{ card: exertedDefender, exerted: true }],
      deck: 3,
    },
    { play: [restrictedEnemy], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(mrBigDistributionMagnate, { targets: [exertedDefender] }),
  ).not.toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(mrBigDistributionMagnate, { targets: [restrictedEnemy] }),
  ).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().challenge(restrictedEnemy, exertedDefender),
  ).not.toBeSuccessfulCommand();
});

for (const illegal of [aladdinPrinceAli, bellesHouseMauricesWorkshop]) {
  it(`Ice Out rejects ${illegal.name} without losing its legal choice`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mrBigDistributionMagnate],
        inkwell: 2,
        play: [{ card: exertedDefender, exerted: true }],
        deck: 3,
      },
      { play: [illegal, restrictedEnemy], deck: 3 },
    );
    expect(game.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(mrBigDistributionMagnate, { targets: [illegal] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(mrBigDistributionMagnate, { targets: [restrictedEnemy] }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(restrictedEnemy, exertedDefender),
    ).not.toBeSuccessfulCommand();
  });
}

it("Mr Big unpaid play preserves ink and normal inking does not trigger Ice Out", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [mrBigDistributionMagnate],
    inkwell: 1,
    deck: 3,
  });
  expect(game.asPlayerOne().playCard(mrBigDistributionMagnate)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(mrBigDistributionMagnate)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(1);
  expect(
    game.asPlayerOne().putIntoInkwell("player_one", mrBigDistributionMagnate),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(2);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.getInkDrops("player_one")).toBe(0);
});

it("Mr Big paid entry waits until next turn to quest and has no play trigger", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [mrBigDistributionMagnate], inkwell: 3, deck: 3 },
    { play: [{ card: restrictedEnemy, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(1);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().quest(mrBigDistributionMagnate)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().challenge(mrBigDistributionMagnate, restrictedEnemy),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(mrBigDistributionMagnate)).toBe(false);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(mrBigDistributionMagnate)).toBeSuccessfulCommand();
  expect(game.getLore("player_one")).toBe(1);
  expect(game.getInkDrops("player_one")).toBe(0);
});

for (const enemies of [[], [aladdinPrinceAli], [bellesHouseMauricesWorkshop]]) {
  it(`Ice Out completes the turn with no legal targets among ${enemies.length} opposing cards`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [mrBigDistributionMagnate], inkwell: 2, deck: 3 },
      { play: enemies, deck: 3 },
    );
    expect(game.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects().length).toBe(0);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  });
}

it("Ice Out does not trigger at the opponent's end of turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [mrBigDistributionMagnate], inkwell: 2, deck: 3 },
    { play: [restrictedEnemy], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(mrBigDistributionMagnate)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(mrBigDistributionMagnate, { targets: [restrictedEnemy] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getPendingEffects().length).toBe(0);
});
