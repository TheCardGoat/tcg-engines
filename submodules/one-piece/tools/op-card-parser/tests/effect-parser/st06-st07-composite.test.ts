import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

const lifeLook =
  "Look at up to 1 card from the top of your or your opponent's Life cards, and place it at the top or bottom of the Life cards.";
const choice =
  "Your opponent chooses one: - Trash 1 card from the top of your opponent's Life cards. - Add 1 card from the top of your deck to the top of your Life cards.";

test("Great Eruption Trigger requires the opponent's hand choice", () => {
  expect(
    buildCardEffects("[Trigger] Your opponent chooses 1 card from their hand and trashes it.")
      ?.effects,
  ).toMatchObject([
    { trigger: "trigger", actions: [{ action: "trashFromHand", player: "opponent", amount: 1 }] },
  ]);
});
test("White Out Trigger draws then protects current Characters", () => {
  expect(
    buildCardEffects(
      "[Trigger] Draw 1 card and none of your Characters can be K.O.'d during this turn.",
    )?.effects,
  ).toMatchObject([
    {
      trigger: "trigger",
      actions: [
        { action: "draw", amount: 1 },
        {
          action: "cannotBeKod",
          target: { player: "self", zones: ["character"], count: { amount: "all" } },
          duration: "thisTurn",
        },
      ],
    },
  ]);
});
test.each(["On Play", "Main"])(
  "Linlin and Soul Pocus retain the opponent-owned %s choice",
  (timing) => {
    expect(buildCardEffects(`[${timing}] ${choice}`)?.effects?.[0]?.actions).toMatchObject([
      {
        action: "choice",
        player: "opponent",
        options: [
          [{ action: "removeFromLife", player: "opponent", count: { amount: 1 } }],
          [{ action: "addToLife" }],
        ],
      },
    ]);
  },
);
test("Power Mochi Counter preserves private Life look before battle power", () => {
  expect(
    buildCardEffects(
      `[Counter] ${lifeLook} Then, up to 1 of your Leader or Character cards gains +2000 power during this battle.`,
    )?.effects?.[0]?.actions,
  ).toMatchObject([
    { action: "lookAtLife", player: "either", upTo: true },
    { action: "modifyPower", value: 2000 },
  ]);
});
test("Power Mochi Trigger draws before its private Life look", () => {
  expect(
    buildCardEffects(`[Trigger] Draw 1 card, ${lifeLook.toLowerCase()}`)?.effects?.[0]?.actions,
  ).toMatchObject([
    { action: "draw", amount: 1 },
    { action: "lookAtLife", player: "either", upTo: true },
  ]);
});

test.each([
  choice.replaceAll(" - ", "- "),
  choice.replaceAll(" - ", "\n- "),
  choice.replaceAll(" - ", " • "),
])("opponent choice accepts official bullet layout %s", (text) => {
  const actions = buildCardEffects(`[Main] ${text}`)?.effects?.[0]?.actions;
  expect(actions).toHaveLength(1);
  expect(actions?.[0]).toMatchObject({
    action: "choice",
    player: "opponent",
    options: [[{ action: "removeFromLife" }], [{ action: "addToLife" }]],
  });
});
