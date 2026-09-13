import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { sirensOfSafeHarbor } from "./sirens-of-safe-harbor.ts";

export const sirensOfSafeHarborI18n = defineFamilyI18n(sirensOfSafeHarbor, {
  en: {
    name: "Sirens of Safe Harbor",
    text: "When this is put into your graveyard from anywhere, gain 1{h}.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: sirensOfSafeHarborRedI18n,
  yellow: sirensOfSafeHarborYellowI18n,
  blue: sirensOfSafeHarborBlueI18n,
} = sirensOfSafeHarborI18n.cards;
