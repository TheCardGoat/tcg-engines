import { isChosenPlayerTarget, isPlayerTargetDescriptor } from "../targeting/runtime";
import { expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockItem,
} from "./index";
const item = createMockItem({ id: "chosen-discard-item", name: "Item", cost: 1 });
const card = createMockCharacter({ id: "chosen-discard-hand", name: "Hand", cost: 1 });
const draw = createMockCharacter({ id: "chosen-discard-draw", name: "Draw", cost: 1 });
const action = createMockAction({
  id: "chosen-discard-action",
  name: "Sequence",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          { type: "draw", amount: 1, target: "CONTROLLER" },
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: {
              type: "banish",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
          },
          {
            type: "conditional",
            condition: { type: "if-you-do" },
            then: {
              type: "discard",
              amount: 1,
              target: { selector: "chosen", count: 1, excludeSelf: true },
              from: "hand",
              chosen: true,
            },
          },
        ],
      },
    },
  ],
});
it("selects a player after a prior item selection and retains it through opponent discard", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [action], inkwell: 1, deck: [draw], play: [item] },
    { hand: [card] },
  );
  expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [item] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBoard().pendingEffects[0]?.selectionContext).toMatchObject({
    kind: "target-selection",
    chooserId: PLAYER_ONE,
    cardCandidateIds: [],
    playerCandidateIds: [PLAYER_TWO],
    minSelections: 1,
    maxSelections: 1,
  });
  expect(game.asPlayerOne().respondWith(PLAYER_ONE)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(card)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBoard().pendingEffects[0]?.selectionContext).toMatchObject({
    kind: "discard-choice",
    chooserId: PLAYER_TWO,
    minSelections: 1,
    maxSelections: 1,
  });
  expect(game.asPlayerTwo().respondWith(card)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(card)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(draw)).toBe("hand");
});
it("declining the optional item branch does not create player or discard prompts", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [action], inkwell: 1, deck: 6, play: [item] },
    { hand: [card] },
  );
  expect(game.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(card)).toBe("hand");
  expect(game.asPlayerOne().getCardZone(item)).toBe("play");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});

it("keeps a normalized card reference distinct from a chosen player", () => {
  expect(isChosenPlayerTarget({ selector: "chosen", count: 1, reference: "trigger-subject" })).toBe(
    false,
  );
  expect(isPlayerTargetDescriptor({ selector: "chosen", count: 1, ref: "trigger-subject" })).toBe(
    false,
  );
  expect(isChosenPlayerTarget({ selector: "chosen", count: 1, excludeSelf: true })).toBe(true);
});
