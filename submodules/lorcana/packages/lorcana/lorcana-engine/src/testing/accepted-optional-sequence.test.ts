import { expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "./index";
const top = createMockCharacter({ id: "optional-sequence-top", name: "Top", cost: 1 });
const bottom = createMockCharacter({ id: "optional-sequence-bottom", name: "Bottom", cost: 1 });
const item = createMockItem({
  id: "optional-sequence-item",
  name: "Trade",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            { type: "draw", amount: 1, target: "CONTROLLER" },
            { type: "discard", amount: 1, chosen: true, from: "hand", target: "CONTROLLER" },
          ],
        },
      },
    },
  ],
});
it("accepting an optional sequence makes its later discard mandatory", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [item],
    inkwell: 1,
    deck: [bottom, top],
  });
  expect(game.asPlayerOne().playCard(item)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(item, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(top)).toBe("hand");
  const prompt = game.asPlayerOne().getBoard().pendingEffects[0]?.selectionContext;
  expect(prompt).toMatchObject({
    kind: "discard-choice",
    chooserId: PLAYER_ONE,
    minSelections: 1,
    maxSelections: 1,
  });
  expect(
    prompt && "originatesFromOptional" in prompt ? prompt.originatesFromOptional : undefined,
  ).not.toBe(true);
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: false }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(top)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(top)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(bottom)).toBe("deck");
});
it("declining the original sequence draws nothing and creates no discard prompt", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [item],
    inkwell: 1,
    deck: [bottom, top],
  });
  expect(game.asPlayerOne().playCard(item)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(item, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(top)).toBe("deck");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});

it("preserves a later nested optional as a separate choice", () => {
  const nested = createMockItem({
    id: "optional-sequence-nested",
    name: "Nested trade",
    cost: 1,
    abilities: [
      {
        type: "triggered",
        trigger: { event: "play", on: "SELF", timing: "when" },
        effect: {
          type: "optional",
          chooser: "CONTROLLER",
          effect: {
            type: "sequence",
            steps: [
              { type: "draw", amount: 1, target: "CONTROLLER" },
              {
                type: "optional",
                chooser: "CONTROLLER",
                effect: {
                  type: "discard",
                  amount: 1,
                  chosen: true,
                  from: "hand",
                  target: "CONTROLLER",
                },
              },
            ],
          },
        },
      },
    ],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [nested],
    inkwell: 1,
    deck: [bottom, top],
  });
  expect(game.asPlayerOne().playCard(nested)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(nested, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(top)).toBe("hand");
  expect(game.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(top)).toBe("hand");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});
