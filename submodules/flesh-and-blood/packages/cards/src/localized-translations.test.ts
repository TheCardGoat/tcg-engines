import { describe, expect, it } from "vitest";

import { CARD_I18N_BY_CANONICAL_ID } from "./generated/card-registry.generated.ts";
import * as de from "./translations/de-DE.ts";
import * as es from "./translations/es-ES.ts";
import * as fr from "./translations/fr-FR.ts";
import * as itLocale from "./translations/it-IT.ts";

const HEART_OF_FYENDAL_BLUE = "pBpLPQ7kg6mkBpNMMPdCD";

describe("selective Flesh and Blood localized translations", () => {
  it("exposes every sourced Fab Cube locale through its own module", () => {
    expect([de, es, fr, itLocale].map((module) => module.fleshAndBloodTranslations.locale)).toEqual(
      ["de-DE", "es-ES", "fr-FR", "it-IT"],
    );
  });

  it("carries French text joined by canonical id with source provenance", () => {
    const heart = fr.fleshAndBloodTranslations.cards.find(
      (card) => card.canonicalId === HEART_OF_FYENDAL_BLUE,
    );
    expect(heart?.name).toBe("Cœur de Fyendal");
    expect(heart?.functionalTextPlain).toContain("Légendaire");
    expect(fr.fleshAndBloodTranslations.provenance).toMatchObject({
      locale: "fr-FR",
      sourceRef: "usurp-the-shadow-throne",
    });
  });

  it("keeps one printing per locale without exposing upstream source URLs", () => {
    const printings = fr.fleshAndBloodLocalizedPrintingsByCanonicalId.get(HEART_OF_FYENDAL_BLUE);
    expect(printings).toHaveLength(1);
    expect(printings?.[0]?.locale).toBe("fr-FR");
    expect(printings?.[0]?.externalIds?.fabCube).toBe(printings?.[0]?.id);
    expect(printings?.[0]?.imageUrl).toMatch(
      /^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/full\/[a-f0-9]{64}\.webp$/,
    );
    expect(printings?.[0]?.boardImageUrl).toMatch(
      /^https:\/\/cdn\.tcg\.online\/public\/fab\/assets\/board\/[a-f0-9]{64}\.webp$/,
    );
  });

  it("uses exact/language locale text and falls back to English", () => {
    expect(fr.getFleshAndBloodCardLocaleText(HEART_OF_FYENDAL_BLUE, "fr-CA")?.name).toBe(
      "Cœur de Fyendal",
    );
    expect(fr.getFleshAndBloodCardLocaleText(HEART_OF_FYENDAL_BLUE, "de-DE")?.name).toBe(
      "Heart of Fyendal",
    );
    const rhinar = "wr9wBtTWwRrPrdhCRHCdN";
    expect(fr.getFleshAndBloodCardLocaleText(rhinar, "fr-FR")?.name).toBe(
      "Rhinar, Reckless Rampage",
    );
  });

  it("does not invent cards upstream does not cover", () => {
    for (const locale of [de, es, fr, itLocale]) {
      expect(locale.fleshAndBloodCardLocaleTextByCanonicalId.size).toBe(3);
    }
  });
});

describe("authored .i18n.ts locale entries", () => {
  it("carries the currently sourced localizations in the authored i18n layer", () => {
    const i18n = CARD_I18N_BY_CANONICAL_ID.get(HEART_OF_FYENDAL_BLUE);
    expect(i18n?.locales["fr-FR"]?.name).toBe("Cœur de Fyendal");
    expect(i18n?.locales["de-DE"]?.name).toBe("Herz von Fyendal");
    expect(i18n?.locales["it-IT"]?.name).toBe("Cuore di Fyendal");
    expect(i18n?.locales["es-ES"]?.name).toBe("Corazón de Fyendal");
    expect(i18n?.locales.en.name).toBe("Heart of Fyendal");
  });
});
