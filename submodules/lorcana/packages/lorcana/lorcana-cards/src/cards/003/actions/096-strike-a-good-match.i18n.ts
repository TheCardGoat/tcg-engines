import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const strikeAGoodMatchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Strike a Good Match",
    text: "Draw 2 cards, then choose and discard a card.",
  },
  de: {
    name: "Ein guter Ehemann",
    text: "Ziehe 2 Karten. Wähle danach 1 Karte aus deiner Hand und wirf sie ab.",
  },
  fr: {
    name: "Crois-moi j'ai vu pire",
    text: "Piochez 2 cartes puis choisissez et défaussez une carte.",
  },
  it: {
    name: "Un Uomo Purché Sia",
    text: "(Un personaggio con costo 2 o superiore può per giocare questa canzone gratis.) Pesca 2 carte, poi scegli e scarta 1 carta.",
  },
};
