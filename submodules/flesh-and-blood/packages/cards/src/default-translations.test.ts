import { describe, expect, it } from "vitest";

import { defaultTranslationsFromCatalog } from "./default-translations.ts";
import { fleshAndBloodCatalog } from "./generated/flesh-and-blood-catalog.ts";

describe("defaultTranslationsFromCatalog", () => {
  it("derives asset URLs for the catalog locale from the default printing", () => {
    const translations = defaultTranslationsFromCatalog(fleshAndBloodCatalog);
    const rhinar = translations.cards.find((card) => card.name === "Rhinar, Reckless Rampage");
    expect(rhinar?.imageUrl).toMatch(/^https:\/\/cdn\.tcg\.online\/.+\.webp$/);
    expect(rhinar?.boardImageUrl).toMatch(/^https:\/\/cdn\.tcg\.online\/.+\.webp$/);
  });

  it("omits asset URLs for cards whose printings carry none", () => {
    const translations = defaultTranslationsFromCatalog(fleshAndBloodCatalog);
    const withoutAssets = translations.cards.filter((card) => !card.imageUrl);
    const catalogWithoutAssets = fleshAndBloodCatalog.cards.filter(
      (card) => !card.printings.some((printing) => printing.imageUrl),
    );
    expect(withoutAssets.length).toBeGreaterThan(0);
    expect(withoutAssets.length).toBe(catalogWithoutAssets.length);
  });

  it("keeps the catalog locale on the translation catalog", () => {
    const translations = defaultTranslationsFromCatalog(fleshAndBloodCatalog);
    expect(translations.locale).toBe(fleshAndBloodCatalog.provenance?.locale ?? "en-US");
  });
});
