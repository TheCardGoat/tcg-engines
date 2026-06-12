import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rememberWhoYouAreI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Remember Who You Are",
    text: "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
  },
  de: {
    name: "Vergiss niemals, wer du bist",
    text: "Wenn eine gegnerische Person deiner Wahl mehr Karten auf der Hand hat als du, ziehe so viele Karten, bis ihr die selbe Anzahl an Handkarten habt.",
  },
  fr: {
    name: "N'oublie pas qui tu es",
    text: "Choisissez un adversaire. Si vous avez moins de cartes en main que lui, piochez pour en avoir autant que lui.",
  },
  it: {
    name: "Ricordati Chi Sei",
    text: "Se un avversario a tua scelta ha più carte in mano di te, pesca carte finché non ne hai lo stesso numero.",
  },
};
