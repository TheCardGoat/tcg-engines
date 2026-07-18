import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
import { parseActions } from "../../src/effect-parser/action-parsers/orchestrator.ts";

describe("EB02 Event parser grammar", () => {
  test("keeps an aggregate Leader-and-Character power target", () => {
    expect(
      parseActions(
        "Up to a total of 3 of your Leader and Character cards gain +1000 power during this turn.",
      ),
    ).toEqual({
      parsed: [
        {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["leader", "character"],
            count: { amount: 3, upTo: true },
          },
          value: 1000,
          duration: "thisTurn",
        },
      ],
      unparsed: "",
    });
  });

  test("freezes the Character selected by the preceding action", () => {
    expect(
      parseActions("the selected Character will not become active in your next Refresh Phase"),
    ).toEqual({
      parsed: [
        {
          action: "freeze",
          target: { player: "self", zones: ["character"], count: { amount: 1 } },
          previousActionTargets: true,
        },
      ],
      unparsed: "",
    });
  });

  test("keeps GERMA 66's filtered cost before its conditional same-name play", () => {
    expect(
      buildCardEffects(
        '[Main] You may trash 1 "GERMA 66" type Character card with 4000 power or less from your hand: If the number of DON!! cards on your field is equal to or less than the number on your opponent\'s field, play up to 1 Character card with 5000 to 7000 power and the same card name as the trashed card from your trash.',
      )?.effects,
    ).toEqual([
      {
        trigger: "main",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              { filter: "trait", value: "GERMA 66", match: "includes" },
              { filter: "cardCategory", value: "character" },
              { filter: "power", comparison: "lte", value: 4000 },
            ],
          },
        ],
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "trash" },
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "power", comparison: "gte", value: 5000 },
              { filter: "power", comparison: "lte", value: 7000 },
              { filter: "cardCategory", value: "character" },
            ],
            sameNameAsPreviousCard: true,
            condition: { condition: "donFieldComparison", selfComparison: "lte" },
          },
        ],
        optional: true,
      },
    ]);
  });

  test("keeps a qualified trait branch or a named Character branch", () => {
    expect(
      parseActions(
        'play up to 1 of your yellow "Straw Hat Crew" type Character cards or [Sanji] with a cost of 5 or less from your hand',
      ).parsed,
    ).toEqual([
      {
        action: "play",
        source: { player: "self", zone: "hand" },
        count: { amount: 1, upTo: true },
        filters: [
          { filter: "cost", comparison: "lte", value: 5 },
          { filter: "cardCategory", value: "character" },
          {
            filter: "anyOf",
            groups: [
              [
                { filter: "color", value: "yellow" },
                { filter: "trait", value: "Straw Hat Crew", match: "includes" },
              ],
              [{ filter: "name", value: "Sanji" }],
            ],
          },
        ],
      },
    ]);
  });

  test("snapshots current Characters for a turn-long Counter K.O. replacement", () => {
    expect(
      buildCardEffects(
        "[Counter] If any of your Characters would be K.O.'d in battle during this turn, you may trash 1 card from your hand instead. [Trigger] Draw 1 card.",
      ),
    ).toEqual({
      effects: [
        {
          trigger: "counter",
          actions: [
            {
              action: "battleKoReplacement",
              target: {
                player: "self",
                zones: ["character"],
                count: { amount: "all" },
              },
              duration: "thisTurn",
            },
          ],
        },
        {
          trigger: "trigger",
          actions: [{ action: "draw", player: "self", amount: 1 }],
        },
      ],
    });
  });
});
