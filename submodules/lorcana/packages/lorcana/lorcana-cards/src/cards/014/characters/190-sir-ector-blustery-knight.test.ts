// CR 6.2.1 and 6.2.3: each qualifying victory triggers one draw.
import { fanTheFlames } from "../../001/actions/131-fan-the-flames";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { sirEctorBlusteryKnight } from "./190-sir-ector-blustery-knight";

const doomedVictim = createMockCharacter({
  id: "ector-victim",
  name: "Doomed Victim",
  cost: 1,
  strength: 0,
  willpower: 6,
});

const myExertedTarget = createMockCharacter({
  id: "ector-target",
  name: "Exerted Target",
  cost: 2,
  strength: 1,
  willpower: 9,
});

const suicidalAttacker = createMockCharacter({
  id: "ector-suicidal-attacker",
  name: "Suicidal Attacker",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Sir Ector - Blustery Knight", () => {
  it("draws a card when he banishes a character in a challenge during his turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [sirEctorBlusteryKnight],
        inkwell: sirEctorBlusteryKnight.cost,
        deck: 2,
        play: [{ card: myExertedTarget, exerted: true }],
      },
      { play: [{ card: doomedVictim, exerted: true }] },
    );

    expect(testEngine.asPlayerOne().playCard(sirEctorBlusteryKnight)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The victim re-exerts itself challenging my exerted target.
    expect(
      testEngine.asPlayerTwo().challenge(doomedVictim, myExertedTarget),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // 6 strength banishes the 6-willpower victim.
    expect(
      testEngine.asPlayerOne().challenge(sirEctorBlusteryKnight, doomedVictim),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
    // 0 after playing Ector + 1 turn draw + 1 from Well Deserved.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("does not draw when banishing the attacker during the opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: sirEctorBlusteryKnight, exerted: true }],
        deck: 2,
      },
      { play: [{ card: suicidalAttacker, exerted: true }] },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The 1-strength attacker dies to Sir Ector's 6 strength; Sir Ector
    // banished a character in a challenge, but it is the opponent's turn.
    expect(
      testEngine.asPlayerTwo().challenge(suicidalAttacker, sirEctorBlusteryKnight),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(suicidalAttacker)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(sirEctorBlusteryKnight)).toBe("play");
    // No Well Deserved draw outside your turn.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
});

describe("Sir Ector victory boundaries", () => {
  for (const [strength, willpower, draws] of [
    [4, 6, 1],
    [0, 7, 0],
  ]) {
    it(`draws ${draws} against ${strength} strength and ${willpower} willpower`, () => {
      const victim = createMockCharacter({
        id: "ector-boundary-victim",
        name: "Boundary Victim",
        cost: 1,
        strength,
        willpower,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: sirEctorBlusteryKnight, isDrying: false }], deck: 3 },
        { play: [{ card: victim, exerted: true }], deck: 3 },
      );
      expect(game.asPlayerOne().challenge(sirEctorBlusteryKnight, victim)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getZonesCardCount().hand).toBe(draws);
      expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3 - draws);
      expect(game.asPlayerTwo().getCardZone(victim)).toBe(draws ? "discard" : "play");
      expect(game.asPlayerOne().getCardZone(sirEctorBlusteryKnight)).toBe(
        strength === 4 ? "discard" : "play",
      );
      if (!draws) expect(game.asPlayerTwo().getDamage(victim)).toBe(6);
    });
  }

  it("does not draw for a different friendly character's victory", () => {
    const ally = createMockCharacter({
      id: "ector-ally",
      name: "Victorious Ally",
      cost: 1,
      strength: 6,
      willpower: 4,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: sirEctorBlusteryKnight, isDrying: false },
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
  });

  it("draws only for player two when player two wins on their own turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
      { play: [{ card: sirEctorBlusteryKnight, isDrying: false }], deck: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().challenge(sirEctorBlusteryKnight, doomedVictim),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(doomedVictim)).toBe("discard");
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  });
});

describe("Sir Ector repeated rewards and normal actions", () => {
  it("draws once for each victory after a paid ready effect", () => {
    const second = createMockCharacter({
      id: "ector-second",
      name: "Second Victim",
      strength: 0,
      willpower: 6,
      cost: 1,
    });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: sirEctorBlusteryKnight, isDrying: false }],
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
    expect(
      game.asPlayerOne().challenge(sirEctorBlusteryKnight, doomedVictim),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(
      game.asPlayerOne().playCard(fanTheFlames, { targets: [sirEctorBlusteryKnight] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().challenge(sirEctorBlusteryKnight, second)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(game.asPlayerTwo().getCardZone(second)).toBe("discard");
  });

  it("does not draw for an action banishment or a quest", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: sirEctorBlusteryKnight, isDrying: false }],
        hand: [dragonFire],
        inkwell: 5,
        deck: 3,
      },
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
    );
    expect(
      game.asPlayerOne().playCard(dragonFire, { targets: [doomedVictim] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
    expect(game.asPlayerOne().quest(sirEctorBlusteryKnight)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  });

  it("rejects unpaid play and permits normal inking without a draw", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sirEctorBlusteryKnight],
      inkwell: 4,
      deck: 3,
    });
    expect(game.asPlayerOne().playCard(sirEctorBlusteryKnight)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(sirEctorBlusteryKnight)).toBe("hand");
    expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(4);
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", sirEctorBlusteryKnight),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(5);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
  });

  it("paid entry has no draw and remains Fresh Ink until its next turn", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [sirEctorBlusteryKnight], inkwell: 5, deck: 3 },
      { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
    );
    expect(game.asPlayerOne().playCard(sirEctorBlusteryKnight)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk("player_one")).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(game.asPlayerOne().quest(sirEctorBlusteryKnight)).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().challenge(sirEctorBlusteryKnight, doomedVictim),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().isExerted(sirEctorBlusteryKnight)).toBe(false);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(sirEctorBlusteryKnight)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(2);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });
});

// CR 1.8.1.2: an empty deck causes loss at the end of the player's turn.
it("Sir Ector resolves an empty-deck reward without a prompt and loses when passing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: sirEctorBlusteryKnight, isDrying: false }], deck: [] },
    { play: [{ card: doomedVictim, exerted: true }], deck: 3 },
  );
  expect(
    game.asPlayerOne().challenge(sirEctorBlusteryKnight, doomedVictim),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(doomedVictim)).toBe("discard");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(0);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
  expect(game.asPlayerOne().getPendingEffects().length).toBe(0);
  expect(game.asServer().isGameOver()).toBe(false);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asServer().isGameOver()).toBe(true);
  expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
});
