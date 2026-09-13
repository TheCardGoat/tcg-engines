import { describe, expect, it } from "bun:test";
import type { CardText, LorcanaCardDefinition } from "@tcg/lorcana-types";

import {
  cardHasName,
  getCardNameVariants,
  getPrintedKeywordTitles,
  getPrintedKeywordValues,
  hasKeyword,
} from "./card-utils";

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
      es: { name: "Printed Keyword Test", text },
      fr: { name: "Printed Keyword Test", text },
      it: { name: "Printed Keyword Test", text },
    },
    set: "test",
  };
}

describe("printed keyword text", () => {
  it("handles legacy raw string keyword text", () => {
    const card = cardWithText("Singer 5");

    expect(getPrintedKeywordTitles(card)).toEqual(["Singer"]);
    expect(getPrintedKeywordValues(card)).toEqual({ Singer: 5 });
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
    expect(getPrintedKeywordValues(card)).toEqual({ Resist: 1 });
    expect(hasKeyword(card, "Resist")).toBe(true);
    expect(hasKeyword(card, "Shift")).toBe(true);
  });

  it("matches presence-only structured keyword titles", () => {
    const card = cardWithText([
      {
        title: "Ward",
        description: "Opponents can't choose this character except to challenge.",
      },
    ]);

    expect(getPrintedKeywordTitles(card)).toEqual(["Ward"]);
    expect(hasKeyword(card, "Ward")).toBe(true);
  });
});

describe("cardHasName / ampersand names (CR 5.2.6.1)", () => {
  function characterNamed(name: string): LorcanaCardDefinition {
    return {
      ...cardWithText([]),
      name,
      cardType: "character",
    };
  }

  it("matches the full printed name and each ampersand half", () => {
    const team = characterNamed("Darkwing Duck & Launchpad");

    expect(getCardNameVariants(team)).toEqual([
      "Darkwing Duck & Launchpad",
      "Darkwing Duck",
      "Launchpad",
    ]);
    expect(cardHasName(team, "Darkwing Duck & Launchpad")).toBe(true);
    expect(cardHasName(team, "Darkwing Duck")).toBe(true);
    expect(cardHasName(team, "Launchpad")).toBe(true);
    expect(cardHasName(team, "Gizmoduck")).toBe(false);
  });

  it("does not treat a solo Launchpad as named Darkwing Duck", () => {
    const launchpad = characterNamed("Launchpad");

    expect(cardHasName(launchpad, "Launchpad")).toBe(true);
    expect(cardHasName(launchpad, "Darkwing Duck")).toBe(false);
  });

  it("matches case-insensitively after accent normalization", () => {
    const team = characterNamed("Darkwing Duck & Launchpad");

    expect(cardHasName(team, "darkwing duck")).toBe(true);
    expect(cardHasName(team, "LAUNCHPAD")).toBe(true);
  });
});
