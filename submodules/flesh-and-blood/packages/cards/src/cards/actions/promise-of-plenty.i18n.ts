import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { promiseOfPlenty } from "./promise-of-plenty.ts";

export const promiseOfPlentyI18n = defineFamilyI18n(promiseOfPlenty, {
  en: {
    name: "Promise of Plenty",
    text: "If Promise of Plenty hits, each hero who doesn't have a card in their arsenal puts the top card of their deck face down into their arsenal.\nIf Promise of Plenty is played from arsenal, it gains go again.",
    typeText: "Generic Action - Attack",
  },
});

export const {
  red: promiseOfPlentyRedI18n,
  yellow: promiseOfPlentyYellowI18n,
  blue: promiseOfPlentyBlueI18n,
} = promiseOfPlentyI18n.cards;
