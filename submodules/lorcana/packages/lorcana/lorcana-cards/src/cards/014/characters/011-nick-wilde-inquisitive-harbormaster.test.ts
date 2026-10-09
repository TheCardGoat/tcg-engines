// CR 2.2.0: 8.10.1-8.10.6 Shift state; 3.2.1.3 duration; 8.15.1 Ward.
// Adventurous follows this card’s printed reminder: cannot challenge; must quest if able.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { nickWildeInquisitiveHarbormaster } from "./011-nick-wilde-inquisitive-harbormaster";

const shiftBase = createMockCharacter({
  id: "nick-ihm-shift-base",
  name: "Nick Wilde",
  version: "Shift Base",
  cost: 6,
  strength: 3,
  willpower: 5,
});

const opposingCharacter = createMockCharacter({
  id: "nick-ihm-opposing",
  name: "Opposing Character",
  cost: 4,
  strength: 4,
  willpower: 4,
});

const challenger = createMockCharacter({
  id: "nick-ihm-challenger",
  name: "Challenger",
  cost: 3,
  strength: 5,
  willpower: 5,
});

describe("Nick Wilde - Inquisitive Harbormaster", () => {
  it("shifts for 4 {I} onto a Nick Wilde character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: shiftBase, isDrying: false, damage: 2 }],
      hand: [nickWildeInquisitiveHarbormaster],
      inkwell: 4,
      deck: 6,
    });

    const shiftTargetId = testEngine.findCardInstanceId(shiftBase, "play");
    expect(
      testEngine.asPlayerOne().playCard(nickWildeInquisitiveHarbormaster, {
        cost: { cost: "shift", shiftTarget: shiftTargetId },
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(nickWildeInquisitiveHarbormaster)).toBe("play");
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCardsUnderCount(nickWildeInquisitiveHarbormaster)).toBe(1);
    expect(testEngine.asPlayerOne().getDamage(nickWildeInquisitiveHarbormaster)).toBe(2);
    expect(
      testEngine.asPlayerOne().quest(nickWildeInquisitiveHarbormaster),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: false }),
    ).toBeSuccessfulCommand();
  });

  it("gives chosen character can't challenge and must quest until start of your next turn on quest", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nickWildeInquisitiveHarbormaster, isDrying: false }],
        deck: 6,
      },
      {
        play: [opposingCharacter],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().quest(nickWildeInquisitiveHarbormaster),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: true,
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
    expect(testEngine.hasRestriction(opposingCharacter, "must-quest")).toBe(true);

    // The restricted character cannot challenge.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(opposingCharacter, nickWildeInquisitiveHarbormaster),
    ).not.toBeSuccessfulCommand();
  });

  it("requires questing on the opponent's turn and expires at the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nickWildeInquisitiveHarbormaster, isDrying: false }],
        deck: 3,
      },
      {
        play: [opposingCharacter, { card: challenger, isDrying: false }],
        deck: 3,
      },
    );

    expect(
      testEngine.asPlayerOne().quest(nickWildeInquisitiveHarbormaster),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: true,
        targets: [opposingCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
    expect(
      testEngine.asPlayerTwo().challenge(opposingCharacter, nickWildeInquisitiveHarbormaster),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(opposingCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(false);
    expect(testEngine.hasRestriction(opposingCharacter, "must-quest")).toBe(false);
  });

  it("does not restrict anything when declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nickWildeInquisitiveHarbormaster, isDrying: false }],
        deck: 6,
      },
      {
        play: [opposingCharacter],
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().quest(nickWildeInquisitiveHarbormaster),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(false);
    expect(testEngine.hasRestriction(opposingCharacter, "must-quest")).toBe(false);
  });

  for (const state of [
    { isDrying: true, exerted: false },
    { isDrying: false, exerted: true },
  ]) {
    it(`Shift preserves the base being ${state.isDrying ? "drying" : "exerted"}`, () => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [nickWildeInquisitiveHarbormaster],
        play: [{ card: shiftBase, ...state }],
        inkwell: 4,
        deck: 6,
      });
      expect(
        game.asPlayerOne().playCard(nickWildeInquisitiveHarbormaster, {
          cost: { cost: "shift", shiftTarget: game.findCardInstanceId(shiftBase, "play") },
        }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().isExerted(nickWildeInquisitiveHarbormaster)).toBe(state.exerted);
      expect(game.asPlayerOne().quest(nickWildeInquisitiveHarbormaster).success).toBe(false);
      expect(game.getLore(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().getBagCount()).toBe(0);
    });
  }
  it("rejects a different-name Shift target without payment or moving either card", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nickWildeInquisitiveHarbormaster],
      play: [challenger],
      inkwell: 4,
      deck: 6,
    });
    expect(
      game.asPlayerOne().playCard(nickWildeInquisitiveHarbormaster, {
        cost: { cost: "shift", shiftTarget: game.findCardInstanceId(challenger, "play") },
      }).success,
    ).toBe(false);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerOne().getCardZone(nickWildeInquisitiveHarbormaster)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(challenger)).toBe("play");
    expect(game.asPlayerOne().getCardsUnderCount(challenger)).toBe(0);
  });
});

it("Player Two resolves exact copies independently and retains the duration after source return", () => {
  const bounce = createMockAction({
    id: "nick-return",
    name: "Return Nick",
    cost: 0,
    abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [opposingCharacter], deck: 6 },
    {
      play: [nickWildeInquisitiveHarbormaster, nickWildeInquisitiveHarbormaster],
      hand: [bounce],
      deck: 6,
    },
  );
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  const target = game.findCardInstanceId(opposingCharacter, "play", PLAYER_ONE);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(copies[0])).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(copies[0], { resolveOptional: true, targets: [target] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(1);
  expect(game.hasRestriction(target, "cant-challenge")).toBe(false);
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(copies[0], { resolveOptional: true, targets: [target] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(copies[1])).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(copies[1], { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.hasRestriction(copies[1], "must-quest")).toBe(false);
  expect(game.asPlayerTwo().playCard(bounce, { targets: [copies[0]] })).toBeSuccessfulCommand();
  expect(game.asServer().getCard(copies[0]).zone).toBe("hand");
  expect(game.hasRestriction(target, "cant-challenge")).toBe(true);
  expect(game.hasRestriction(target, "must-quest")).toBe(true);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.hasRestriction(target, "cant-challenge")).toBe(true);
  expect(game.asPlayerOne().passTurn()).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(target)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.hasRestriction(target, "cant-challenge")).toBe(false);
  expect(game.hasRestriction(target, "must-quest")).toBe(false);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
});

it("rejects hidden, item and opposing Ward choices and accepts own Ward", () => {
  const ward = createMockCharacter({
    id: "nick-ward",
    name: "Ward Character",
    cost: 1,
    abilities: [{ type: "keyword", keyword: "Ward" }],
  });
  const item = createMockItem({ id: "nick-item", name: "Item Target", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [ward, item], hand: [opposingCharacter], deck: 6 },
    { play: [nickWildeInquisitiveHarbormaster, ward], deck: 6 },
  );
  const ownWard = game.findCardInstanceId(ward, "play", PLAYER_TWO);
  const enemyWard = game.findCardInstanceId(ward, "play", PLAYER_ONE);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(nickWildeInquisitiveHarbormaster)).toBeSuccessfulCommand();
  for (const target of [
    enemyWard,
    game.findCardInstanceId(item, "play", PLAYER_ONE),
    game.findCardInstanceId(opposingCharacter, "hand", PLAYER_ONE),
  ]) {
    expect(
      game.asPlayerTwo().resolvePendingByCard(nickWildeInquisitiveHarbormaster, {
        resolveOptional: true,
        targets: [target],
      }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(game.hasRestriction(ownWard, "must-quest")).toBe(false);
  }
  expect(
    game.asPlayerTwo().resolvePendingByCard(nickWildeInquisitiveHarbormaster, {
      resolveOptional: true,
      targets: [ownWard],
    }),
  ).toBeSuccessfulCommand();
  expect(game.hasRestriction(ownWard, "cant-challenge")).toBe(true);
  expect(game.hasRestriction(ownWard, "must-quest")).toBe(true);
  expect(game.hasRestriction(enemyWard, "cant-challenge")).toBe(false);
  expect(game.asPlayerTwo().passTurn()).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(ownWard)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.hasRestriction(ownWard, "must-quest")).toBe(true);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.hasRestriction(ownWard, "must-quest")).toBe(false);
  expect(game.hasRestriction(ownWard, "cant-challenge")).toBe(false);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
});

it("can choose itself without requiring another quest while exerted", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [nickWildeInquisitiveHarbormaster], deck: 6 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().quest(nickWildeInquisitiveHarbormaster)).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .resolveOnlyBag({ resolveOptional: true, targets: [nickWildeInquisitiveHarbormaster] }),
  ).toBeSuccessfulCommand();
  expect(game.hasRestriction(nickWildeInquisitiveHarbormaster, "cant-challenge")).toBe(true);
  expect(game.hasRestriction(nickWildeInquisitiveHarbormaster, "must-quest")).toBe(true);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.hasRestriction(nickWildeInquisitiveHarbormaster, "cant-challenge")).toBe(false);
  expect(game.hasRestriction(nickWildeInquisitiveHarbormaster, "must-quest")).toBe(false);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
});

it("does not require a fresh chosen character to quest before passing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [nickWildeInquisitiveHarbormaster], hand: [challenger], inkwell: 3, deck: 6 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(challenger)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(nickWildeInquisitiveHarbormaster)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveOnlyBag({ resolveOptional: true, targets: [challenger] }),
  ).toBeSuccessfulCommand();
  expect(game.hasRestriction(challenger, "must-quest")).toBe(true);
  expect(game.asPlayerOne().quest(challenger)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.hasRestriction(challenger, "cant-challenge")).toBe(false);
  expect(game.hasRestriction(challenger, "must-quest")).toBe(false);
  expect(game.asPlayerOne().getBagCount()).toBe(0);
});
