import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

const draw = (amount: number) => ({ action: "draw", player: "self", amount });
const handCondition = { condition: "handCount", player: "self", comparison: "lte", value: 5 };

describe("conditional choice sequences", () => {
  test("checks a choice condition once around its actions and the shared Then", () => {
    const effects = buildCardEffects(
      "[Main] Choose one:\n• Draw 1 card.\n• If you have 5 or less cards in your hand, draw 1 card.\nThen, draw 1 card.",
    );
    expect(effects?.effects?.[0]?.actions).toEqual([
      {
        action: "choice",
        options: [
          [draw(1), draw(1)],
          [{ action: "conditional", predicate: handCondition, whenTrue: [draw(1), draw(1)] }],
        ],
      },
    ]);
  });

  test("checks an option's internal If/Then condition once", () => {
    const effects = buildCardEffects(
      "[Main] Choose one:\n• If you have 5 or less cards in your hand, draw 1 card. Then, draw 1 card.\n• Draw 3 cards.",
    );
    expect(effects?.effects?.[0]?.actions).toEqual([
      {
        action: "choice",
        options: [
          [{ action: "conditional", predicate: handCondition, whenTrue: [draw(1), draw(1)] }],
          [draw(3)],
        ],
      },
    ]);
  });

  test("keeps an unconditional choice's shared Then independent of target selection", () => {
    const effects = buildCardEffects(
      "[Main] Choose one:\n• Draw 1 card.\n• Draw 2 cards.\nThen, draw 3 cards.",
    );
    expect(effects?.effects?.[0]?.actions).toEqual([
      { action: "choice", options: [[draw(1)], [draw(2)]] },
      draw(3),
    ]);
  });
});

test("OP15-054 keeps its play continuation inside the first branch", () => {
  const effects = buildCardEffects(
    "[Main] If your Leader is [Lucy], choose one:\n• Draw 2 cards and trash 1 card from your hand. Then, play up to 1 {Dressrosa} type Character card with a cost of 4 or less from your hand.\n• Return up to 1 Stage to the owner's hand.",
  );
  expect(effects?.effects?.[0]?.conditions).toEqual([{ condition: "leaderName", name: "Lucy" }]);
  const actions = effects?.effects?.[0]?.actions;
  expect(actions).toHaveLength(1);
  const choice = actions?.[0];
  if (choice?.action !== "choice") throw new Error("Expected the printed choice.");
  expect(choice.options[0]?.map((action) => action.action)).toEqual([
    "draw",
    "trashFromHand",
    "play",
  ]);
  expect(choice.options[1]?.map((action) => action.action)).toEqual(["returnToHand"]);
});
