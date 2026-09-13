import printingsJson from "../generated/flesh-and-blood-localized-printings-de-DE.json" with { type: "json" };
import translationsJson from "../generated/flesh-and-blood-translations-de-DE.json" with { type: "json" };
import { fleshAndBloodCardTranslationsByCanonicalId } from "../index.ts";
import { createFleshAndBloodLocalizedTranslationView } from "./runtime.ts";

const view = createFleshAndBloodLocalizedTranslationView({
  translationsJson,
  printingsJson,
  englishByCanonicalId: fleshAndBloodCardTranslationsByCanonicalId,
});

export const fleshAndBloodTranslations = view.translations;
export const fleshAndBloodLocalizedPrintingsByCanonicalId = view.printingsByCanonicalId;
export const fleshAndBloodCardLocaleTextByCanonicalId = view.cardLocaleTextByCanonicalId;
export const getFleshAndBloodCardLocaleText = view.getCardLocaleText;
