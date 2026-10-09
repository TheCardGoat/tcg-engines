import { expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "../testing";

const card = createMockCharacter({ id: "chooser-hand", name: "Hand", cost: 1 });
const action = createMockAction({
  id: "restricted-mode",
  name: "Restricted mode",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "choice",
        chooser: { selector: "chosen", count: 1, excludeSelf: true },
        options: [
          {
            type: "sequence",
            steps: [
              { type: "reveal-hand", target: "CHOSEN_PLAYER" },
              {
                type: "discard",
                amount: 1,
                from: "hand",
                target: "CHOSEN_PLAYER",
                chosen: true,
                chosenBy: "you",
              },
              { type: "gain-ink-drop", amount: 2, target: "CHOSEN_PLAYER" },
            ],
          },
          { type: "gain-ink-drop", amount: 2, target: "CONTROLLER" },
        ],
      },
    },
  ],
});
for (const choice of [0, 1]) {
  it(`retains the restricted chooser through mode ${choice} and subsequent card selection`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [action], inkwell: 1 },
      { hand: [card], deck: 6 },
    );
    expect(
      game.asPlayerOne().playCard(action, { targets: [PLAYER_ONE] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(game.asPlayerOne().getCardZone(action)).toBe("hand");
    expect(game.asPlayerOne().playCard(action, { targets: [PLAYER_TWO] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().respondWithChoice(choice)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().respondWithChoice(choice)).toBeSuccessfulCommand();
    if (choice === 0) {
      expect(game.asPlayerOne().getBoard().pendingEffects[0]?.selectionContext).toMatchObject({
        kind: "discard-choice",
        chooserId: PLAYER_ONE,
        minSelections: 1,
        maxSelections: 1,
      });
      const prompt = game.asPlayerOne().getBoard().pendingEffects[0]?.selectionContext;
      expect(
        prompt && "originatesFromOptional" in prompt ? prompt.originatesFromOptional : undefined,
      ).not.toBe(true);
      expect(game.asPlayerOne().resolveNextPending({ targets: [] })).not.toBeSuccessfulCommand();
      expect(game.asPlayerTwo().respondWith(card)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().respondWith(card)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getCardZone(card)).toBe("discard");
    }
    expect(game.getInkDrops(PLAYER_ONE)).toBe(choice === 1 ? 2 : 0);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(choice === 0 ? 2 : 0);
  });
}

it("selects the opponent before the mode when play has no supplied target", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [action], inkwell: 1 },
    { hand: [card], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_ONE)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBoard().pendingEffects[0]?.selectionContext).toMatchObject({
    kind: "discard-choice",
    chooserId: PLAYER_ONE,
    minSelections: 1,
    maxSelections: 1,
  });
  expect(game.asPlayerOne().respondWith(card)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(card)).toBe("discard");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
});

it("offers opponent selection for consecutive copies after returning from the other player's choice", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [action, action, card], inkwell: 2, deck: 6 },
    { hand: [card, card], deck: 6 },
  );
  const p1 = game.asPlayerOne();
  expect(p1.playCard(action)).toBeSuccessfulCommand();
  expect(p1.enumerateMoves()).toContain("resolveEffect");
  expect(p1.respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBoard().pendingEffects[0]?.selectionContext).toMatchObject({
    kind: "discard-choice",
    chooserId: PLAYER_ONE,
    minSelections: 1,
    maxSelections: 1,
  });
  const opposingCard = game.findCardInstanceId(card, "hand", PLAYER_TWO);
  expect(p1.respondWith(opposingCard)).toBeSuccessfulCommand();
  expect(p1.playCard(action)).toBeSuccessfulCommand();
  expect(p1.enumerateMoves()).toContain("resolveEffect");
  expect(p1.respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
});
