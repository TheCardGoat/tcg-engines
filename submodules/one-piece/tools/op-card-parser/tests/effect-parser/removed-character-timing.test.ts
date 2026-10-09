import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/index.ts";

test("Buggy retains DON, usage, owner and trait limits on removal timing", () => {
  const effects = buildCardEffects(
    "[DON!! x1] [Once Per Turn] This effect can be activated when your {Impel Down} type Character card is removed from the field. Play up to 1 [Prisoner of Impel Down] card from your hand.",
  );
  expect(effects?.effects).toHaveLength(1);
  expect(effects?.effects?.[0]).toMatchObject({
    trigger: "whenCharacterRemoved",
    conditions: [{ condition: "donAttached", amount: 1 }],
    eventFilter: {
      player: "self",
      filters: [
        { filter: "cardCategory", value: "character" },
        { filter: "trait", value: "Impel Down", match: "exact" },
      ],
    },
    oncePerTurn: true,
    optional: true,
    actions: [
      {
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
        filters: [{ filter: "name", value: "Prisoner of Impel Down" }],
      },
    ],
  });
  expect(effects?.effects?.[0]?.eventFilter?.causedBy).toBeUndefined();
});

test("recognizes the same trait removal timing with quoted names and no card noun", () => {
  const block = buildCardEffects(
    'This effect can be activated when your "Straw Hat Crew" type Character is removed from the field. Draw 1 card.',
  )?.effects?.[0];
  expect(block).toMatchObject({
    trigger: "whenCharacterRemoved",
    optional: true,
    eventFilter: {
      player: "self",
      filters: [
        { filter: "cardCategory", value: "character" },
        { filter: "trait", value: "Straw Hat Crew", match: "exact" },
      ],
    },
    actions: [{ action: "draw", player: "self", amount: 1 }],
  });
});

test("retains the same owner and trait for ordinary When wording", () => {
  const block = buildCardEffects(
    'When your "Impel Down" type Character is removed from the field, draw 1 card.',
  )?.effects?.[0];
  expect(block).toMatchObject({
    trigger: "whenCharacterRemoved",
    eventFilter: {
      player: "self",
      filters: [
        { filter: "cardCategory", value: "character" },
        { filter: "trait", value: "Impel Down", match: "exact" },
      ],
    },
  });
  expect(block?.optional).toBeUndefined();
});
