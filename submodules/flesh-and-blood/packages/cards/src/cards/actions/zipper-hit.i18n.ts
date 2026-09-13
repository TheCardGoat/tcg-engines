import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { zipperHit } from "./zipper-hit.ts";

export const zipperHitI18n = defineFamilyI18n(zipperHit, {
  en: {
    name: "Zipper Hit",
    text: "Boost",
    typeText: "Mechanologist Action - Attack",
  },
});

export const {
  red: zipperHitRedI18n,
  yellow: zipperHitYellowI18n,
  blue: zipperHitBlueI18n,
} = zipperHitI18n.cards;
