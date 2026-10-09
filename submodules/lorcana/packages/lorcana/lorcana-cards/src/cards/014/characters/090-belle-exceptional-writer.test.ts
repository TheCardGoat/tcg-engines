// CR 6.2.1: trigger only when its condition is met; 8.10.1-8.10.6: Shift cost, own-name target and inherited states/damage.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockCharacter,
  createMockSong,
  createMockItem,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { belleExceptionalWriter } from "./090-belle-exceptional-writer";

const bigAction = createMockAction({
  id: "belle-writer-big-action",
  name: "Grand Gesture",
  cost: 4,
});

const followUpAction = createMockAction({
  id: "belle-writer-followup",
  name: "Follow Up",
  cost: 2,
});

const cheapActionA = createMockAction({
  id: "belle-writer-cheap-a",
  name: "Quick Note A",
  cost: 1,
});

const cheapActionB = createMockAction({
  id: "belle-writer-cheap-b",
  name: "Quick Note B",
  cost: 1,
});

const cheapActionC = createMockAction({
  id: "belle-writer-cheap-c",
  name: "Quick Note C",
  cost: 1,
});

describe("Belle - Exceptional Writer", () => {
  it("Hyperia City Tips pays 2 {I} less for the next action after she exerts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleExceptionalWriter],
      hand: [bigAction, followUpAction],
      inkwell: 4,
      deck: 6,
    });
    expect(testEngine.asPlayerOne().quest(belleExceptionalWriter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(bigAction)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(testEngine.asPlayerOne().playCard(followUpAction)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("Hyperia City Tips requires Belle to exert first", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleExceptionalWriter, bigAction],
      inkwell: 7,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(belleExceptionalWriter)).toBeSuccessfulCommand();

    // Without exerting Belle, the remaining 2 ink can't pay for a 4-cost action.
    expect(testEngine.asPlayerOne().playCard(bigAction)).not.toBeSuccessfulCommand();
  });

  it("Hyperia City Secrets gains 3 lore when you play your third action this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleExceptionalWriter, cheapActionA, cheapActionB, cheapActionC],
      inkwell: 8,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(belleExceptionalWriter)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(cheapActionB)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(testEngine.asPlayerOne().playCard(cheapActionC)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
  });

  it("Hyperia City Secrets does not trigger before the third action", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleExceptionalWriter, cheapActionA, cheapActionB],
      inkwell: 8,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(belleExceptionalWriter)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(cheapActionB)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});

it("awards lore only on the third action, not the fourth or fifth", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [belleExceptionalWriter],
    hand: [cheapActionA, cheapActionB, cheapActionC, cheapActionA, cheapActionB],
    inkwell: 5,
    deck: 6,
  });
  for (const [index, action] of [
    cheapActionA,
    cheapActionB,
    cheapActionC,
    cheapActionA,
    cheapActionB,
  ].entries()) {
    expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(index >= 2 ? 3 : 0);
  }
});

const baseBelle = createMockCharacter({ id: "writer-base-belle", name: "Belle", cost: 2 });
const otherCharacter = createMockCharacter({
  id: "writer-other",
  name: "Other",
  cost: 1,
  strength: 1,
  willpower: 8,
});
const item = createMockItem({ id: "writer-item", name: "Other Item", cost: 1 });
const song = createMockSong({ id: "writer-song", name: "Song", cost: 2, text: "A song." });
const exertAction = createMockAction({
  id: "writer-exert",
  name: "Exert",
  cost: 1,
  abilities: [{ type: "action", effect: { type: "exert", target: "CHOSEN_CHARACTER" } }],
});

it("singing creates a discount for the next action, not the song already played", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [belleExceptionalWriter],
    hand: [song, bigAction, followUpAction],
    inkwell: 4,
    deck: 6,
  });
  expect(game.asPlayerOne().singSong(song, belleExceptionalWriter)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerOne().playCard(bigAction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().playCard(followUpAction)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(3);
});
it("challenge exertion creates the discount", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [belleExceptionalWriter], hand: [bigAction], inkwell: 2, deck: 6 },
    { play: [{ card: otherCharacter, exerted: true }], deck: 6 },
  );
  expect(
    game.asPlayerOne().challenge(belleExceptionalWriter, otherCharacter),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(bigAction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("non-action plays preserve the discount and cheap actions consume it", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [belleExceptionalWriter],
    hand: [otherCharacter, item, cheapActionA, bigAction],
    inkwell: 4,
    deck: 6,
  });
  expect(game.asPlayerOne().quest(belleExceptionalWriter)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(otherCharacter)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(item)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(
    game.asPlayerOne().playCard(game.findCardInstanceId(cheapActionA, "hand", PLAYER_ONE)),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().playCard(bigAction)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(bigAction)).toBe("hand");
});
it("stacks independent exertion discounts on exactly one next action", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [belleExceptionalWriter, belleExceptionalWriter],
    hand: [bigAction, followUpAction],
    inkwell: 2,
    deck: 6,
  });
  for (const id of game.getCardInstanceIdsInZone("play", PLAYER_ONE))
    expect(game.asPlayerOne().quest(id)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(bigAction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().playCard(followUpAction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("expires the unused discount and resets third-action counting next turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [belleExceptionalWriter],
      hand: [cheapActionA, cheapActionB, cheapActionC, bigAction],
      inkwell: 4,
      deck: 6,
    },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(cheapActionB)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(belleExceptionalWriter)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(bigAction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.getLore(PLAYER_ONE)).toBe(2);
});
it("opponent-turn exertion and opposing actions give neither discount nor lore", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [belleExceptionalWriter], hand: [cheapActionA, bigAction], inkwell: 4, deck: 6 },
    { hand: [exertAction, cheapActionA, cheapActionB, cheapActionC], inkwell: 4, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(exertAction, { targets: [belleExceptionalWriter] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(belleExceptionalWriter)).toBe(true);
  for (const action of [cheapActionA, cheapActionB, cheapActionC])
    expect(
      game.asPlayerTwo().playCard(game.findCardInstanceId(action, "hand", PLAYER_TWO)),
    ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.getLore(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(bigAction)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
});
it("each copy rewards the third action including actions played before Belle", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [
      cheapActionA,
      cheapActionB,
      cheapActionC,
      cheapActionA,
      belleExceptionalWriter,
      belleExceptionalWriter,
    ],
    inkwell: 14,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(cheapActionB)).toBeSuccessfulCommand();
  for (let copy = 0; copy < 2; copy++)
    expect(
      game
        .asPlayerOne()
        .playCard(game.findCardInstanceId(belleExceptionalWriter, "hand", PLAYER_ONE)),
    ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(cheapActionC)).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount())
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(game.findCardInstanceId(belleExceptionalWriter, "play", PLAYER_ONE)),
    ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(6);
  expect(game.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(6);
});
it("Shift pays three and inherits exertion/damage without a new exertion trigger", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [belleExceptionalWriter, bigAction],
    play: [{ card: baseBelle, exerted: true, damage: 1 }],
    inkwell: 6,
    deck: 6,
  });
  const shiftTarget = game.findCardInstanceId(baseBelle, "play", PLAYER_ONE);
  expect(
    game.asPlayerOne().playCard(belleExceptionalWriter, { cost: { cost: "shift", shiftTarget } }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().isExerted(belleExceptionalWriter)).toBe(true);
  expect(game.asPlayerOne()).toHaveDamage({ card: belleExceptionalWriter, value: 1 });
  expect(game.asPlayerOne().playCard(bigAction)).not.toBeSuccessfulCommand();
});
it("rejects wrong-name/opposing Shift targets before payment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [belleExceptionalWriter], play: [otherCharacter], inkwell: 3, deck: 6 },
    { play: [baseBelle], deck: 6 },
  );
  for (const shiftTarget of [
    game.findCardInstanceId(otherCharacter, "play", PLAYER_ONE),
    game.findCardInstanceId(baseBelle, "play", PLAYER_TWO),
  ]) {
    expect(
      game.asPlayerOne().playCard(belleExceptionalWriter, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().getCardZone(belleExceptionalWriter)).toBe("hand");
  }
});
it("requires the full Shift payment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [belleExceptionalWriter],
    play: [baseBelle],
    inkwell: 2,
    deck: 6,
  });
  const shiftTarget = game.findCardInstanceId(baseBelle, "play", PLAYER_ONE);
  expect(
    game.asPlayerOne().playCard(belleExceptionalWriter, { cost: { cost: "shift", shiftTarget } }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getCardZone(belleExceptionalWriter)).toBe("hand");
});
it("own-turn effect exertion triggers once but exerting an already exerted Belle does not", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [belleExceptionalWriter],
    hand: [exertAction, exertAction, bigAction],
    inkwell: 4,
    deck: 6,
  });
  for (let n = 0; n < 2; n++) {
    expect(
      game.asPlayerOne().playCard(game.findCardInstanceId(exertAction, "hand", PLAYER_ONE), {
        targets: [belleExceptionalWriter],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  }
  expect(game.asPlayerOne().playCard(bigAction)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
});

it("player two receives their own exertion discount and third-action lore only", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [belleExceptionalWriter], inkwell: 4, deck: 6 },
    {
      play: [belleExceptionalWriter],
      hand: [bigAction, cheapActionA, cheapActionB, cheapActionC],
      inkwell: 5,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const own = game.findCardInstanceId(belleExceptionalWriter, "play", PLAYER_TWO);
  expect(game.asPlayerTwo().quest(own)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().playCard(bigAction)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().playCard(cheapActionB)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().playCard(cheapActionC)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_TWO)).toBe(5);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
});

it("starts a new action count and requires a new exertion after the turn changes", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [belleExceptionalWriter],
      hand: [cheapActionA, cheapActionB, bigAction, cheapActionA, cheapActionB, cheapActionC],
      inkwell: 7,
      deck: 6,
    },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(cheapActionB)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(belleExceptionalWriter)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(bigAction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().playCard(cheapActionB)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerOne().playCard(cheapActionC)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(5);
});

it("Player Two's exact copies ignore opposing exertions/actions and work on their own next turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [exertAction, exertAction, exertAction], inkwell: 3, deck: 6 },
    {
      play: [belleExceptionalWriter, belleExceptionalWriter],
      hand: [cheapActionA, bigAction, cheapActionB],
      inkwell: 4,
      deck: 6,
    },
  );
  const belles = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  const exerts = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  for (const [index, action] of exerts.entries()) {
    expect(
      game.asPlayerOne().playCard(action, { targets: [belles[index === 2 ? 1 : 0]!] }),
    ).toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
  }
  expect(game.asPlayerTwo().isExerted(belles[0]!)).toBe(true);
  expect(game.asPlayerTwo().isExerted(belles[1]!)).toBe(true);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(cheapActionA)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().playCard(bigAction)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().getCardZone(bigAction)).toBe("hand");
  expect(game.asPlayerTwo().quest(belles[0]!)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(bigAction)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
  expect(game.getLore(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerTwo().playCard(cheapActionB)).toBeSuccessfulCommand();
  game.asPlayerTwo().resolveAllBagEffects({ maxIterations: 10 });
  expect(game.getLore(PLAYER_TWO)).toBe(8);
  expect(game.getLore(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});
