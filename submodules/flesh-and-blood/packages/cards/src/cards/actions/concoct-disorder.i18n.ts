import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { concoctDisorder } from "./concoct-disorder.ts";

export const concoctDisorderI18n = defineFamilyI18n(concoctDisorder, {
  en: {
    name: "Concoct Disorder",
    text: "When this attacks, each hero puts the top card of their deck face-down into their arsenal. If 2 or more cards are put into arsenals this way, this gets go again.",
    typeText: "Chaos Action - Attack",
  },
});
export const {
  red: concoctDisorderRedI18n,
  yellow: concoctDisorderYellowI18n,
  blue: concoctDisorderBlueI18n,
} = concoctDisorderI18n.cards;
