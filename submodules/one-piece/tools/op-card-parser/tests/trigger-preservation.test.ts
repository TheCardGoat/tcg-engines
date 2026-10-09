import { describe, expect, test } from "vite-plus/test";
import { buildCardEffects } from "../src/effect-parser/index.ts";
import { joinPrintedAbilityText } from "../src/printed-text.ts";
import { assertTriggerPreserved } from "../src/trigger-preservation.ts";

const effect = "[Main] Draw 1 card.";
const completeText = joinPrintedAbilityText({ effect, trigger: "Draw 1 card." });
const complete = buildCardEffects(completeText);
const incomplete = buildCardEffects(effect);

describe("Trigger preservation before regeneration", () => {
  test("rejects incomplete source instead of erasing an existing Trigger", () => {
    expect(() =>
      assertTriggerPreserved({
        cardId: "source-loss",
        printedText: effect,
        current: complete,
        generated: incomplete,
      }),
    ).toThrow(/source-loss:.*Review the official Trigger text/);
  });

  test.each([incomplete, undefined])("rejects supplied Trigger lost by parsing", (generated) => {
    expect(() =>
      assertTriggerPreserved({
        cardId: "parser-loss",
        printedText: completeText,
        current: undefined,
        generated,
      }),
    ).toThrow(/regeneration would lose/);
  });

  test("preserves separate Trigger metadata through the public parser", () => {
    expect(complete?.effects?.map((block) => block.trigger)).toEqual(["main", "trigger"]);
    expect(() =>
      assertTriggerPreserved({
        cardId: "complete",
        printedText: completeText,
        current: complete,
        generated: complete,
      }),
    ).not.toThrow();
  });

  test("permits cards without a Trigger and mid-sentence property references", () => {
    expect(() =>
      assertTriggerPreserved({
        cardId: "property",
        printedText: "Add a card with a [Trigger] to your hand.",
        current: incomplete,
        generated: incomplete,
      }),
    ).not.toThrow();
    expect(() =>
      assertTriggerPreserved({
        cardId: "vanilla",
        printedText: "",
        current: undefined,
        generated: undefined,
      }),
    ).not.toThrow();
  });
});
