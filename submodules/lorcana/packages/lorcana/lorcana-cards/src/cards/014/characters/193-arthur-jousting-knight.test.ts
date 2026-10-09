import { dragonFire } from "../../001/actions/130-dragon-fire";
import { fanTheFlames } from "../../001/actions/131-fan-the-flames";
import { arthurNoviceBlacksmith } from "./185-arthur-novice-blacksmith";
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { arthurJoustingKnight } from "./193-arthur-jousting-knight";

const doomedVictim = createMockCharacter({
  id: "jousting-victim",
  name: "Doomed Victim",
  cost: 1,
  strength: 0,
  willpower: 5,
});

const myExertedTarget = createMockCharacter({
  id: "jousting-target",
  name: "Exerted Target",
  cost: 2,
  strength: 1,
  willpower: 9,
});

describe("Arthur - Jousting Knight", () => {
  it("draws a card and gains an ink drop when he banishes a character in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [arthurJoustingKnight],
        inkwell: arthurJoustingKnight.cost,
        deck: 2,
        play: [{ card: myExertedTarget, exerted: true }],
      },
      { play: [{ card: doomedVictim, exerted: true }] },
    );

    expect(testEngine.asPlayerOne().playCard(arthurJoustingKnight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The victim re-exerts itself challenging my exerted sacrificial character.
    expect(
      testEngine.asPlayerTwo().challenge(doomedVictim, myExertedTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // 3 strength + 2 Challenger = 5 damage banishes the 5-willpower victim.
    expect(
      testEngine.asPlayerOne().challenge(arthurJoustingKnight, doomedVictim),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
    expect(testEngine.getServerState().G.inkDrops[PLAYER_ONE]).toBe(1);
    // 0 after playing Arthur + 1 turn draw + 1 from VICTORY PURSE.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });
});

describe("Arthur - Jousting Knight (Shift)", () => {
  it("shifts onto an Arthur character for 4 {I} and quests for 2 lore on a dry base (CR 8.10.4)", () => {
    const shiftBase = arthurNoviceBlacksmith;

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [arthurJoustingKnight],
        inkwell: 4,
        play: [{ card: shiftBase, isDrying: false, damage: 1 }],
      },
      {},
    );

    const shiftTargetId = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);
    if (!shiftTargetId) throw new Error("Missing Arthur Shift base");
    expect(
      testEngine.asPlayerOne().playCard(arthurJoustingKnight, {
        cost: { cost: "shift", shiftTarget: shiftTargetId },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(arthurJoustingKnight)).toBe("play");

    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(arthurJoustingKnight)).toBe(1);
    // CR 8.10.4: a shifted character enters play dry when the base was dry.
    // The quest yields Arthur's printed 2 lore.
    expect(testEngine.asPlayerOne().quest(arthurJoustingKnight)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });
});

// CR 6.2.1: each qualifying challenge victory triggers the printed reward.
describe("Arthur Jousting Knight victory boundaries", () => {
  for (const [strength, willpower, reward] of [
    [6, 5, 1],
    [0, 6, 0],
  ]) {
    it(`gains ${reward} reward against ${strength} strength and ${willpower} willpower`, () => {
      const victim = createMockCharacter({
        id: "arthur-boundary",
        name: "Boundary",
        cost: 1,
        strength,
        willpower,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: arthurJoustingKnight, isDrying: false }], deck: 3 },
        { play: [{ card: victim, exerted: true }], deck: 3 },
      );
      expect(game.asPlayerOne().challenge(arthurJoustingKnight, victim)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(reward);
      expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3 - reward);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(reward);
      expect(game.asPlayerTwo().getCardZone(victim)).toBe(reward ? "discard" : "play");
      expect(game.asPlayerOne().getCardZone(arthurJoustingKnight)).toBe(
        strength === 6 ? "discard" : "play",
      );
      if (!reward) expect(game.asPlayerTwo().getDamage(victim)).toBe(5);
    });
  }
});

describe("Arthur opponent-turn restriction", () => {
  it("does not gain a draw or drop when defending on the opponent turn", () => {
    const attacker = createMockCharacter({
      id: "arthur-attacker",
      name: "Attacker",
      cost: 1,
      strength: 1,
      willpower: 3,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: arthurJoustingKnight, exerted: true }], deck: 3 },
      { play: [attacker], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().challenge(attacker, arthurJoustingKnight)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(attacker)).toBe("discard");
    expect(game.asPlayerOne().getDamage(arthurJoustingKnight)).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });
});

it("Arthur grants both rewards to Player Two on their own turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
    { play: [{ card: arthurJoustingKnight, isDrying: false }], deck: 3 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(arthurJoustingKnight, doomedVictim)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(2);
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(1);
  expect(game.getInkDrops("player_two")).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("Arthur rewards each victory after a paid ready action", () => {
  const second = createMockCharacter({
    id: "arthur-second",
    name: "Second",
    cost: 1,
    strength: 0,
    willpower: 5,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [{ card: arthurJoustingKnight, isDrying: false }],
      hand: [fanTheFlames],
      inkwell: 1,
      deck: 3,
    },
    {
      play: [
        { card: doomedVictim, exerted: true },
        { card: second, exerted: true },
      ],
      deck: 3,
    },
  );
  expect(game.asPlayerOne().challenge(arthurJoustingKnight, doomedVictim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(
    game.asPlayerOne().playCard(fanTheFlames, { targets: [arthurJoustingKnight] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().challenge(arthurJoustingKnight, second)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(1);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("Arthur gains a drop even when its victory draw has an empty deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: arthurJoustingKnight, isDrying: false }], deck: [] },
    { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().challenge(arthurJoustingKnight, doomedVictim)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getPendingEffects().length).toBe(0);
  expect(game.asServer().isGameOver()).toBe(false);
});

for (const state of [
  { isDrying: true, exerted: false },
  { isDrying: false, exerted: true },
]) {
  it(`Arthur inherits Shift base state drying=${state.isDrying} exerted=${state.exerted}`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arthurJoustingKnight],
      inkwell: 4,
      deck: 3,
      play: [{ card: arthurNoviceBlacksmith, ...state, damage: 1 }],
    });
    const shiftTarget = game.findCardInstanceId(arthurNoviceBlacksmith, "play", PLAYER_ONE);
    if (!shiftTarget) throw new Error("Missing Arthur base");
    expect(
      game.asPlayerOne().playCard(arthurJoustingKnight, { cost: { cost: "shift", shiftTarget } }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getDamage(arthurJoustingKnight)).toBe(1);
    expect(game.asPlayerOne().isExerted(arthurJoustingKnight)).toBe(state.exerted);
    expect(game.asPlayerOne().quest(arthurJoustingKnight)).not.toBeSuccessfulCommand();
    expect(game.getLore(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  });
}

it("Arthur normal paid entry has no reward and waits until its next turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [arthurJoustingKnight], inkwell: 6, deck: 3 },
    { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().playCard(arthurJoustingKnight)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().quest(arthurJoustingKnight)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().challenge(arthurJoustingKnight, doomedVictim),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().isExerted(arthurJoustingKnight)).toBe(false);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(arthurJoustingKnight)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
});

it("Arthur unpaid normal play preserves resources and normal inking gives no reward", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [arthurJoustingKnight],
    inkwell: 5,
    deck: 3,
  });
  expect(game.asPlayerOne().playCard(arthurJoustingKnight)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(arthurJoustingKnight)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);
  expect(
    game.asPlayerOne().putIntoInkwell(PLAYER_ONE, arthurJoustingKnight),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(6);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
});

it("Arthur unpaid Shift preserves the damaged dry base", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [arthurJoustingKnight],
    inkwell: 3,
    deck: 3,
    play: [{ card: arthurNoviceBlacksmith, isDrying: false, damage: 1 }],
  });
  const shiftTarget = game.findCardInstanceId(arthurNoviceBlacksmith, "play", PLAYER_ONE);
  if (!shiftTarget) throw new Error("Missing Arthur base");
  expect(
    game.asPlayerOne().playCard(arthurJoustingKnight, { cost: { cost: "shift", shiftTarget } }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().getCardZone(arthurJoustingKnight)).toBe("hand");
  expect(game.asPlayerOne().getDamage(arthurNoviceBlacksmith)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("Arthur has only printed strength while defending", () => {
  const attacker = createMockCharacter({
    id: "arthur-defender-check",
    name: "Attacker",
    cost: 1,
    strength: 1,
    willpower: 4,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: arthurJoustingKnight, exerted: true }], deck: 3 },
    { play: [attacker], deck: 3 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().challenge(attacker, arthurJoustingKnight)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(attacker)).toBe("play");
  expect(game.asPlayerTwo().getDamage(attacker)).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
});

it("Arthur gives no reward for another friendly attacker's victory", () => {
  const ally = createMockCharacter({
    id: "arthur-ally",
    name: "Ally",
    cost: 1,
    strength: 5,
    willpower: 6,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        { card: arthurJoustingKnight, isDrying: false },
        { card: ally, isDrying: false },
      ],
      deck: 3,
    },
    { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
  );
  expect(game.asPlayerOne().challenge(ally, doomedVictim)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("Arthur gives no reward for action banishment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [{ card: arthurJoustingKnight, isDrying: false }],
      hand: [dragonFire],
      inkwell: 5,
      deck: 3,
    },
    { play: [doomedVictim], deck: 3 },
  );
  expect(
    game.asPlayerOne().playCard(dragonFire, { targets: [doomedVictim] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

for (const opposing of [false, true]) {
  it(`Arthur rejects ${opposing ? "opposing Arthur" : "wrong-name friendly"} Shift base`, () => {
    const base = opposing ? arthurNoviceBlacksmith : doomedVictim;
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [arthurJoustingKnight],
        inkwell: 4,
        deck: 3,
        play: opposing ? [] : [{ card: base, isDrying: false }],
      },
      { play: opposing ? [{ card: base, isDrying: false }] : [], deck: 3 },
    );
    const shiftTarget = game.findCardInstanceId(base, "play", opposing ? PLAYER_TWO : PLAYER_ONE);
    if (!shiftTarget) throw new Error("Missing invalid Shift base");
    expect(
      game.asPlayerOne().playCard(arthurJoustingKnight, { cost: { cost: "shift", shiftTarget } }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerOne().getCardZone(arthurJoustingKnight)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  });
}
