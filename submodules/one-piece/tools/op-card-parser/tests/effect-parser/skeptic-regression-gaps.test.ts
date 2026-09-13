import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects, parseActions } from "../../src/effect-parser/index.ts";
import { joinPrintedAbilityText } from "../../src/printed-text.ts";

describe("skeptic regression gaps", () => {
  test("joinPrintedAbilityText never double-prefixes [Trigger]", () => {
    const text = joinPrintedAbilityText({
      effect:
        "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle.",
      trigger:
        "[Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
    });
    expect(text).toBe(
      "[Counter] Up to 1 of your Leader or Character cards gains +3000 power during this battle.\n[Trigger] Up to 1 of your Leader or Character cards gains +1000 power during this turn.",
    );
    expect(text).not.toMatch(/\[Trigger\]\s*\[Trigger\]/);
    const effects = buildCardEffects(text);
    expect(effects?.effects?.map((block) => block.trigger)).toEqual(["counter", "trigger"]);
  });

  test("Diable Jambe Main grants unblockable and Trigger KOs hasKeyword blocker", () => {
    const text = joinPrintedAbilityText({
      effect:
        "[Main] Select up to 1 of your {Straw Hat Crew} type Leader or Character cards. Your opponent cannot activate [Blocker] if that Leader or Character attacks during this turn.",
      trigger:
        "[Trigger] K.O. up to 1 of your opponent's [Blocker] Characters with a cost of 3 or less.",
    });
    const effects = buildCardEffects(text);
    expect(effects?.keywords).toBeUndefined();
    expect(effects?.effects).toEqual([
      {
        trigger: "main",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "trait", value: "Straw Hat Crew", match: "includes" }],
            },
            keyword: "unblockable",
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "hasKeyword", value: "blocker" },
                { filter: "cost", comparison: "lte", value: 3 },
              ],
            },
          },
        ],
      },
    ]);
  });

  test("trash Event or Stage uses anyOf groups not AND filters", () => {
    const result = parseActions("trash 1 Event or Stage card from your hand");
    expect(result.unparsed).toBe("");
    expect(result.parsed).toEqual([
      {
        action: "trashFromHand",
        player: "self",
        amount: 1,
        filters: [
          {
            filter: "anyOf",
            groups: [
              [{ filter: "cardCategory", value: "event" }],
              [{ filter: "cardCategory", value: "stage" }],
            ],
          },
        ],
      },
    ]);
    // AND filters would be two top-level cardCategory entries — that must fail.
    const andShape = result.parsed[0] as {
      filters?: Array<{ filter: string; value?: string }>;
    };
    expect(andShape.filters?.every((filter) => filter.filter === "cardCategory")).toBe(false);
  });

  test("LittleOars effect-KO replacement keeps Event-or-Stage anyOf payment", () => {
    const effects = buildCardEffects(
      "[Once Per Turn] If this Character would be K.O.'d by an effect, you may trash 1 Event or Stage card from your hand instead.",
    );
    const payment = effects?.replacementEffects?.[0]?.replacementAction;
    expect(payment).toMatchObject({
      action: "trashFromHand",
      player: "self",
      amount: 1,
      filters: [
        {
          filter: "anyOf",
          groups: [
            [{ filter: "cardCategory", value: "event" }],
            [{ filter: "cardCategory", value: "stage" }],
          ],
        },
      ],
    });
  });
});
