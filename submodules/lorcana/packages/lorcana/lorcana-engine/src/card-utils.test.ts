import { describe, expect, it } from "bun:test";
import type { CardText, LorcanaCardDefinition } from "@tcg/lorcana-types";

import { getPrintedKeywordTitles, hasKeyword } from "./card-utils";

function cardWithText(text: CardText): LorcanaCardDefinition {
  return {
    id: "test-printed-keyword",
    canonicalId: "ci_test_printed_keyword",
    slug: "lorcana-ci_test_printed_keyword",
    printings: [
      {
        id: "test-printed-keyword",
        artId: "test-printed-keyword",
        setCode: "test",
        collectorNumber: "0",
        rarity: "common",
        imageUrl: "",
      },
    ],
    name: "Printed Keyword Test",
    inkType: ["amber"],
    cost: 1,
    inkable: true,
    cardType: "character",
    text,
    abilities: [],
    i18n: {
      en: { name: "Printed Keyword Test", text },
      de: { name: "Printed Keyword Test", text },
      fr: { name: "Printed Keyword Test", text },
      it: { name: "Printed Keyword Test", text },
    },
    set: "test",
  };
}

describe("printed keyword text", () => {
  it("handles legacy raw string text without crashing", () => {
    const card = cardWithText("Singer 5");

    expect(getPrintedKeywordTitles(card)).toEqual(["Singer"]);
    expect(hasKeyword(card, "Singer")).toBe(true);
  });

  it("matches parameterized structured keyword titles by canonical prefix", () => {
    const card = cardWithText([
      {
        title: "Resist +1",
        description: "Damage dealt to this character is reduced by 1.",
      },
      {
        title: "Shift 3",
        description: "You may pay 3 {I} to play this on top of one of your characters.",
      },
    ]);

    expect(getPrintedKeywordTitles(card)).toEqual(["Resist", "Shift"]);
    expect(hasKeyword(card, "Resist")).toBe(true);
    expect(hasKeyword(card, "Shift")).toBe(true);
  });
});
