import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { whelmingGustwave } from "./whelming-gustwave.ts";

export const whelmingGustwaveI18n = defineFamilyI18n(whelmingGustwave, {
  en: {
    name: "Whelming Gustwave",
    text: 'Combo - If Surging Strike was the last attack this combat chain, this has "When this hits, draw a card."',
    typeText: "Ninja Action - Attack",
  },
});

export const {
  red: whelmingGustwaveRedI18n,
  yellow: whelmingGustwaveYellowI18n,
  blue: whelmingGustwaveBlueI18n,
} = whelmingGustwaveI18n.cards;
