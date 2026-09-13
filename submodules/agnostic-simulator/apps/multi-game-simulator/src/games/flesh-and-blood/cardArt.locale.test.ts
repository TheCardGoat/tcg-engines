import { describe, expect, it } from "vitest";
import { normalizeFabAssetLocale, selectFabPrintingArt } from "./cardArt";
import type { FabCardPresentationRecord } from "@tcg/flesh-and-blood-cards/presentation";

const record: FabCardPresentationRecord = {
  canonicalId: "card",
  slug: "card",
  name: "Card",
  defaultPrintingId: "english",
  imageAspectRatio: 63 / 88,
  keywords: [],
  printings: {
    english: {
      locale: "en-US",
      artId: "original",
      boardImageUrl: "en-square",
      printedImageUrl: "en-full",
    },
    french: {
      locale: "fr-FR",
      artId: "original",
      boardImageUrl: "fr-square",
      printedImageUrl: "fr-full",
    },
    foil: {
      locale: "en-US",
      artId: "special",
      boardImageUrl: "foil-square",
      printedImageUrl: "foil-full",
    },
  },
};

describe("viewer-localized FAB asset pairs", () => {
  it("selects square and full together using exact locale then language", () => {
    expect(selectFabPrintingArt(record, undefined, "fr-FR")).toBe(record.printings.french);
    expect(selectFabPrintingArt(record, "english", "fr-CA")).toBe(record.printings.french);
  });
  it("retains explicit cosmetics when the requested language has no matching artwork", () => {
    expect(selectFabPrintingArt(record, "foil", "fr-FR")).toBe(record.printings.foil);
    expect(selectFabPrintingArt(record, undefined, "ja-JP")).toBe(record.printings.english);
    expect(selectFabPrintingArt(record, "missing", "fr-FR")).toBeUndefined();
  });
  it("normalizes valid locale tags and safely defaults malformed preferences", () => {
    expect(normalizeFabAssetLocale("fr-fr")).toBe("fr-FR");
    expect(normalizeFabAssetLocale("not_a_locale")).toBe("en-US");
  });
});
