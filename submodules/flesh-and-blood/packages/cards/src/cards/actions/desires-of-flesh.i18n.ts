import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { desiresOfFlesh } from "./desires-of-flesh.ts";

export const desiresOfFleshI18n = defineFamilyI18n(desiresOfFlesh, {
  en: {
    name: "Desires of Flesh",
    typeText: "Assassin Action - Attack",
    text: "Stealth\nWhen this hits a hero, banish the top card of their deck.\nWhenever this banishes an attack action card, gain 1{h}.",
  },
});

export const {
  red: desiresOfFleshRedI18n,
  yellow: desiresOfFleshYellowI18n,
  blue: desiresOfFleshBlueI18n,
} = desiresOfFleshI18n.cards;
