// Rules grounding: Hyperia City ink-drop mechanic — each ink drop may be
// removed to pay 1 {I} of any color; drops persist between turns.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { inkcasterSkates } from "../items/067-inkcaster-skates";
import { fredAwesomeBoss } from "./086-fred-awesome-boss";

const superAlly = createMockCharacter({
  id: "fred-boss-super-ally",
  name: "Super Teammate",
  cost: 3,
  classifications: ["Storyborn", "Hero", "Super"],
});

const plainAlly = createMockCharacter({
  id: "fred-boss-plain-ally",
  name: "Ordinary Teammate",
  cost: 2,
});

const shiftBase = createMockCharacter({
  id: "fred-boss-shift-base",
  name: "Fred",
  cost: 2,
  classifications: ["Storyborn", "Hero", "Super"],
});

describe("Fred - Awesome Boss", () => {
  it("playing Fred gets 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fredAwesomeBoss],
      inkwell: fredAwesomeBoss.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(fredAwesomeBoss)).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("playing another Super character gets 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [superAlly],
      play: [fredAwesomeBoss],
      inkwell: superAlly.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(superAlly)).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("playing a character without Super does not get an ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [plainAlly],
      play: [fredAwesomeBoss],
      inkwell: plainAlly.cost,
      deck: 6,
    });

    expect(testEngine.asPlayerOne().playCard(plainAlly)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("shifting Fred still gets 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fredAwesomeBoss],
      play: [shiftBase],
      inkwell: 4,
      deck: 6,
    });

    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(fredAwesomeBoss, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(fredAwesomeBoss)).toBe("play");
  });
});

it("does not trigger for a Super item or an opponent's Super character", () => {
  const item = inkcasterSkates;
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [fredAwesomeBoss], hand: [item], inkwell: 3, deck: 6 },
    { hand: [superAlly], inkwell: 3, inkDrops: 2, deck: 6 },
  );
  expect(game.asPlayerOne().playCard(item)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(superAlly)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
});
it("each active copy awards once, including the newly played copy", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [fredAwesomeBoss],
      hand: [fredAwesomeBoss, superAlly],
      inkwell: 9,
      inkDrops: 3,
      deck: 6,
    },
    { inkDrops: 4, deck: 6 },
  );
  const oldFred = game.findCardInstanceId(fredAwesomeBoss, "play", PLAYER_ONE);
  const newFred = game.findCardInstanceId(fredAwesomeBoss, "hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(newFred)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolvePendingByCard(oldFred)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(5);
  expect(game.asPlayerOne().playCard(superAlly)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolvePendingByCard(newFred)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(7);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("keeps drops across turns and questing does not award again", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [fredAwesomeBoss], inkwell: 6, deck: 6 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(fredAwesomeBoss)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(fredAwesomeBoss)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
});
it("cannot pay normal or shift costs with its future reward", () => {
  for (const shifting of [false, true]) {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fredAwesomeBoss],
      play: [shiftBase],
      inkwell: shifting ? 3 : 5,
      deck: 6,
    });
    const shiftTarget = game.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
    const params = shifting ? { cost: { cost: "shift" as const, shiftTarget } } : undefined;
    expect(game.asPlayerOne().playCard(fredAwesomeBoss, params)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(fredAwesomeBoss)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(shifting ? 3 : 5);
  }
});
it("uses saved drops for Shift and awards one new drop after payment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [fredAwesomeBoss],
    play: [shiftBase],
    inkwell: 3,
    inkDrops: 1,
    deck: 6,
  });
  const shiftTarget = game.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
  expect(
    game
      .asPlayerOne()
      .playCard(fredAwesomeBoss, { cost: { cost: "shift", shiftTarget }, inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().getCardZone(fredAwesomeBoss)).toBe("play");
});
it("a saved drop pays a later Super play before its new reward", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [fredAwesomeBoss, superAlly],
    inkwell: 8,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(fredAwesomeBoss)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(superAlly, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
});
it("stops rewarding after Fred is banished", () => {
  const enemy = createMockCharacter({
    id: "fred-source-removal",
    name: "Heavy Hitter",
    cost: 1,
    strength: 10,
    willpower: 10,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [fredAwesomeBoss], hand: [superAlly], inkwell: 3, deck: 6 },
    { play: [enemy], deck: 6 },
  );
  expect(game.asPlayerOne().quest(fredAwesomeBoss)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(enemy, fredAwesomeBoss)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(fredAwesomeBoss)).toBe("discard");
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(superAlly)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("rejects Shift onto a different name or an opposing Fred before payment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [fredAwesomeBoss], play: [plainAlly], inkwell: 4, deck: 6 },
    { play: [shiftBase], deck: 6 },
  );
  for (const shiftTarget of [
    game.findCardInstanceId(plainAlly, "play", PLAYER_ONE),
    game.findCardInstanceId(shiftBase, "play", PLAYER_TWO),
  ]) {
    expect(
      game.asPlayerOne().playCard(fredAwesomeBoss, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getCardZone(fredAwesomeBoss)).toBe("hand");
  }
});

it("player two shifts using saved drops and rewards only their subsequent Super play", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [shiftBase], inkDrops: 4, deck: 6 },
    { hand: [fredAwesomeBoss, superAlly], play: [shiftBase], inkwell: 5, inkDrops: 1, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const ownBase = game.findCardInstanceId(shiftBase, "play", PLAYER_TWO)!;
  const opposingBase = game.findCardInstanceId(shiftBase, "play", PLAYER_ONE)!;
  expect(
    game.asPlayerTwo().playCard(fredAwesomeBoss, {
      cost: { cost: "shift", shiftTarget: opposingBase },
      inkDrops: 1,
    }),
  ).not.toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .playCard(fredAwesomeBoss, { cost: { cost: "shift", shiftTarget: ownBase }, inkDrops: 1 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.asPlayerTwo().playCard(superAlly, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerOne().getCardZone(opposingBase)).toBe("play");
});

it("Player Two's exact sources stop rewarding independently as each leaves play", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [dragonFire, dragonFire], inkwell: 10, inkDrops: 4, deck: 8 },
    {
      play: [fredAwesomeBoss, fredAwesomeBoss],
      hand: [superAlly, superAlly, superAlly],
      inkwell: 9,
      inkDrops: 3,
      deck: 8,
    },
  );
  const freds = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  const supers = game.getCardInstanceIdsInZone("hand", PLAYER_TWO);
  const removals = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(supers[0]!)).toBeSuccessfulCommand();
  game.asPlayerTwo().resolveAllBagEffects({ maxIterations: 10 });
  expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(removals[0]!, { targets: [freds[0]!] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(freds[0]!)).toBe("discard");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(supers[1]!)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(6);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(removals[1]!, { targets: [freds[1]!] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(freds[1]!)).toBe("discard");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(supers[2]!)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(6);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});

// CR 8.10.2 and 8.10.6: Shift retains the base's exerted state and damage.
it("Player Two's Shift retains damage and exertion while awarding one entry reward", () => {
  const base = createMockCharacter({
    id: "fred-shift-inherited-state",
    name: "Fred",
    cost: 2,
    willpower: 3,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { inkDrops: 4, deck: 6 },
    { play: [{ card: base, damage: 1 }], hand: [fredAwesomeBoss], inkwell: 4, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(base)).toBeSuccessfulCommand();
  const target = game.findCardInstanceId(base, "play", PLAYER_TWO);
  expect(
    game.asPlayerTwo().playCard(fredAwesomeBoss, { cost: { cost: "shift", shiftTarget: target } }),
  ).toBeSuccessfulCommand();
  const source = game.findCardInstanceId(fredAwesomeBoss, "play", PLAYER_TWO);
  expect(game.asPlayerTwo().getDamage(source)).toBe(1);
  expect(game.asPlayerTwo().isExerted(source)).toBe(true);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
});
