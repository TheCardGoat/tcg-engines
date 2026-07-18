import { describe, expect, test } from "vite-plus/test";

import { buildCardEffects } from "../../src/effect-parser/index.ts";

describe("OP04-017/018/055/056/057/074 Event transformations", () => {
  test("preserves Happiness Punch's active-Leader follow-up condition", () => {
    expect(
      buildCardEffects(
        "[Counter] Give up to 1 of your opponent's Leader or Character cards -2000 power during this turn. Then, if your Leader is active, give up to 1 of your opponent's Leader or Character cards -1000 power during this turn.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: -2000,
              duration: "thisTurn",
            },
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: -1000,
              duration: "thisTurn",
              condition: {
                condition: "hasCard",
                player: "self",
                zone: "leader",
                filters: [{ filter: "state", value: "active" }],
              },
            },
          ],
        },
      ],
    });
  });

  test("preserves Enchanting Vertigo Dance's inclusive Leader trait and Trigger", () => {
    expect(
      buildCardEffects(
        "[Main] If your Leader has the [Alabasta] type, give up to 2 of your opponent's Characters -2000 power during this turn. [Trigger] Activate this card's [Main] effect.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          conditions: [{ condition: "leaderTrait", trait: "Alabasta", match: "includes" }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 2, upTo: true },
              },
              value: -2000,
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "activateEffect", effectTrigger: "main" }],
        },
      ],
    });
  });

  test("preserves both Plague Rounds colon costs and its mandatory trash play", () => {
    expect(
      buildCardEffects(
        "[Main] You may trash 1 [Ice Oni] from your hand and place 1 Character with a cost of 4 or less at the bottom of the owner's deck: Play 1 [Ice Oni] from your trash. [Trigger] Activate this card's [Main] effect.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          costs: [
            {
              cost: "trashFromHand",
              amount: 1,
              filters: [{ filter: "name", value: "Ice Oni" }],
            },
            {
              cost: "returnCharacterToDeck",
              amount: 1,
              position: "bottom",
              player: "both",
              filters: [{ filter: "cost", comparison: "lte", value: 4 }],
            },
          ],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1 },
              filters: [{ filter: "name", value: "Ice Oni" }],
            },
          ],
          optional: true,
        },
        {
          trigger: "trigger",
          actions: [{ action: "activateEffect", effectTrigger: "main" }],
        },
      ],
    });
  });

  test("preserves both Gum-Gum Red Roc owner-routed targets", () => {
    expect(
      buildCardEffects(
        "[Main] Place up to 1 Character at the bottom of the owner's deck. [Trigger] Place up to 1 Character with a cost of 4 or less at the bottom of the owner's deck.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "main",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
              },
              position: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
              position: "bottom",
            },
          ],
        },
      ],
    });
  });

  test("preserves Dragon Twister's Counter and Trigger owner-routed movements", () => {
    expect(
      buildCardEffects(
        "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, place up to 1 Character with a cost of 1 or less at the bottom of the owner's deck. [Trigger] Return up to 1 Character with a cost of 6 or less to the owner's hand.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 4000,
              duration: "thisBattle",
            },
            {
              action: "returnToDeck",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 1 }],
              },
              position: "bottom",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "returnToHand",
              target: {
                player: "any",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 6 }],
              },
            },
          ],
        },
      ],
    });
  });

  test("preserves Colors Trap's direct Counter DON!! cost and active-DON Trigger", () => {
    expect(
      buildCardEffects(
        "[Counter] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Up to 1 of your Leader or Character cards gains +1000 power during this battle. Then, rest up to 1 of your opponent's Characters with a cost of 4 or less. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          costs: [{ cost: "returnDon", amount: 1 }],
          actions: [
            {
              action: "modifyPower",
              target: {
                player: "self",
                zones: ["leader", "character"],
                count: { amount: 1, upTo: true },
              },
              value: 1000,
              duration: "thisBattle",
            },
            {
              action: "rest",
              target: {
                player: "opponent",
                zones: ["character"],
                count: { amount: 1, upTo: true },
                filters: [{ filter: "cost", comparison: "lte", value: 4 }],
              },
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [
            {
              action: "addDon",
              count: { amount: 1, upTo: true },
              state: "active",
            },
          ],
        },
      ],
    });
  });
});
