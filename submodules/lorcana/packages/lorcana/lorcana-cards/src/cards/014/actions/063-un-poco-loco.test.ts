import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { aladdinPrinceAli, arielSpectacularSinger, simbaProtectiveCub } from "../../001";
import { unPocoLoco } from "./063-un-poco-loco";

const expensiveAlly = createMockCharacter({
  id: "un-poco-expensive-ally",
  name: "Expensive Ally",
  cost: 4,
});

const pricierAlly = createMockCharacter({
  id: "un-poco-pricier-ally",
  name: "Pricier Ally",
  cost: 5,
});

describe("Un Poco Loco", () => {
  it("returns both chosen characters to your hand when one of them is cost 3 or less", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: unPocoLoco.cost,
      play: [simbaProtectiveCub, expensiveAlly],
      deck: [],
    });

    expect(
      testEngine.asPlayerOne().playCard(unPocoLoco, {
        targets: [simbaProtectiveCub, expensiveAlly],
      }),
    ).toBeSuccessfulCommand();

    // One chosen character (cost 2) satisfies the cost condition, so both
    // return to hand.
    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(expensiveAlly)).toBe("hand");
  });

  it("returns both chosen characters when both are cost 3 or less", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: unPocoLoco.cost,
      play: [simbaProtectiveCub, aladdinPrinceAli],
      deck: [],
    });

    expect(
      testEngine.asPlayerOne().playCard(unPocoLoco, {
        targets: [simbaProtectiveCub, aladdinPrinceAli],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
  });

  it("returns nothing when both chosen characters cost more than 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: unPocoLoco.cost,
      play: [expensiveAlly, pricierAlly],
      deck: [],
    });

    expect(
      testEngine.asPlayerOne().playCard(unPocoLoco, {
        targets: [expensiveAlly, pricierAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(expensiveAlly)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(pricierAlly)).toBe("play");
  });

  it("can be sung for free with Sing Together 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: 0,
      play: [arielSpectacularSinger, simbaProtectiveCub, aladdinPrinceAli],
      deck: [],
    });

    expect(
      testEngine.asPlayerOne().playSongTogether(unPocoLoco, [arielSpectacularSinger]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(arielSpectacularSinger)).toBe(true);

    // Still must choose 2 characters; the cheap one satisfies the condition.
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [simbaProtectiveCub, aladdinPrinceAli],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(aladdinPrinceAli)).toBe("hand");
  });

  it("costs 3 ink to play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: unPocoLoco.cost - 1,
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(unPocoLoco)).toMatchObject({
      success: false,
    });
    expect(testEngine.asPlayerOne().getCardZone(unPocoLoco)).toBe("hand");
  });
  it("returns the pair at the exact cost-3 boundary", () => {
    const boundaryAlly = createMockCharacter({ id: "poco-boundary", name: "Boundary", cost: 3 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: 3,
      play: [boundaryAlly, expensiveAlly],
    });
    expect(
      engine.asPlayerOne().playCard(unPocoLoco, { targets: [expensiveAlly, boundaryAlly] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(boundaryAlly)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(expensiveAlly)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(unPocoLoco)).toBe("discard");
  });

  it("does not use an unselected cheap character to satisfy the condition", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: 3,
      play: [simbaProtectiveCub, expensiveAlly, pricierAlly],
    });
    expect(
      engine.asPlayerOne().playCard(unPocoLoco, { targets: [expensiveAlly, pricierAlly] }),
    ).toBeSuccessfulCommand();
    for (const card of [simbaProtectiveCub, expensiveAlly, pricierAlly]) {
      expect(engine.asPlayerOne().getCardZone(card)).toBe("play");
    }
    expect(engine.asPlayerOne().getCardZone(unPocoLoco)).toBe("discard");
  });

  it("rejects an opposing character without spending the song's ink", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [unPocoLoco], inkwell: 3, play: [simbaProtectiveCub, expensiveAlly] },
      { play: [pricierAlly] },
    );
    expect(
      engine.asPlayerOne().playCard(unPocoLoco, { targets: [simbaProtectiveCub, pricierAlly] })
        .success,
    ).toBe(false);
    expect(engine.asPlayerOne().getCardZone(unPocoLoco)).toBe("hand");
    expect(
      engine.asPlayerOne().playCard(unPocoLoco, { targets: [simbaProtectiveCub, expensiveAlly] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(expensiveAlly)).toBe("hand");
    expect(engine.asPlayerTwo().getCardZone(pricierAlly)).toBe("play");
  });

  it("returns the only eligible character when fewer than two exist", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: 3,
      play: [simbaProtectiveCub],
    });
    expect(
      engine.asPlayerOne().playCard(unPocoLoco, { targets: [simbaProtectiveCub] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(unPocoLoco)).toBe("discard");
  });

  it("allows both singers to be the returned pair when their costs total three", () => {
    const costOne = createMockCharacter({ id: "poco-singer-one", name: "Singer One", cost: 1 });
    const costTwo = createMockCharacter({ id: "poco-singer-two", name: "Singer Two", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: 0,
      play: [costOne, costTwo],
    });
    expect(
      engine.asPlayerOne().playSongTogether(unPocoLoco, [costOne, costTwo]),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().isExerted(costOne)).toBe(true);
    expect(engine.asPlayerOne().isExerted(costTwo)).toBe(true);
    expect(
      engine.asPlayerOne().resolveNextPending({ targets: [costOne, costTwo] }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(costOne)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(costTwo)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(unPocoLoco)).toBe("discard");
  });

  it("rejects singing together below total cost three without exerting the singer", () => {
    const costTwo = createMockCharacter({ id: "poco-short-singer", name: "Short Singer", cost: 2 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [unPocoLoco],
      inkwell: 0,
      play: [costTwo],
    });
    expect(engine.asPlayerOne().playSongTogether(unPocoLoco, [costTwo]).success).toBe(false);
    expect(engine.asPlayerOne().isExerted(costTwo)).toBe(false);
    expect(engine.asPlayerOne().getCardZone(unPocoLoco)).toBe("hand");
  });
  it("player two returns their exact-cost-three singers without affecting opposing characters", () => {
    const one = createMockCharacter({ id: "poco-p2-one", name: "One", cost: 1 });
    const two = createMockCharacter({ id: "poco-p2-two", name: "Two", cost: 2 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [simbaProtectiveCub, expensiveAlly], deck: 6 },
      { play: [one, two, pricierAlly], hand: [unPocoLoco], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = game.asPlayerTwo().getZonesCardCount().hand;
    expect(game.asPlayerTwo().playSongTogether(unPocoLoco, [one, two])).toBeSuccessfulCommand();
    expect(game.isExerted(one)).toBe(true);
    expect(game.isExerted(two)).toBe(true);
    expect(game.asPlayerTwo().resolveNextPending({ targets: [one, two] })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(one)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(two)).toBe("hand");
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before + 1);
    expect(game.asPlayerTwo().getCardZone(pricierAlly)).toBe("play");
    expect(game.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(game.asPlayerOne().getCardZone(expensiveAlly)).toBe("play");
    expect(game.asPlayerTwo().getCardZone(unPocoLoco)).toBe("discard");
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  });
});

it("Player Two returns a selected cost-three character and expensive partner while leaving other cards in play", () => {
  const boundary = createMockCharacter({ id: "poco-p2-boundary", name: "Boundary", cost: 3 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [simbaProtectiveCub], deck: 6 },
    { play: [boundary, expensiveAlly, pricierAlly], hand: [unPocoLoco], inkwell: 3, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(unPocoLoco, { targets: [expensiveAlly, boundary] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(boundary)).toBe("hand");
  expect(game.asPlayerTwo().getCardZone(expensiveAlly)).toBe("hand");
  expect(game.asPlayerTwo().getCardZone(pricierAlly)).toBe("play");
  expect(game.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(unPocoLoco)).toBe("discard");
});
it("Player Two cannot satisfy the condition using an unselected cheap character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    {
      play: [simbaProtectiveCub, expensiveAlly, pricierAlly],
      hand: [unPocoLoco],
      inkwell: 3,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(unPocoLoco, { targets: [expensiveAlly, pricierAlly] }),
  ).toBeSuccessfulCommand();
  for (const card of [simbaProtectiveCub, expensiveAlly, pricierAlly])
    expect(game.asPlayerTwo().getCardZone(card)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(unPocoLoco)).toBe("discard");
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
});
for (const cost of [3, 4]) {
  it(`Player Two chooses the only eligible cost-${cost} character and respects the condition`, () => {
    const only = createMockCharacter({ id: `poco-p2-only-${cost}`, name: "Only Character", cost });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [simbaProtectiveCub], deck: 6 },
      { play: [only], hand: [unPocoLoco], inkwell: 3, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(unPocoLoco, { targets: [only] })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(only)).toBe(cost <= 3 ? "hand" : "play");
    expect(game.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
    expect(game.asPlayerTwo().getCardZone(unPocoLoco)).toBe("discard");
  });
}
it("Player Two resolves with no own characters without choosing an opposing character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [simbaProtectiveCub], deck: 6 },
    { hand: [unPocoLoco], inkwell: 3, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(unPocoLoco)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(unPocoLoco)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(simbaProtectiveCub)).toBe("play");
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
