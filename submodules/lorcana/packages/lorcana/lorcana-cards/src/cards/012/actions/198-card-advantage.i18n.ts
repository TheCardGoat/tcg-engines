import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cardAdvantageI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Card Advantage",
    text: "If an opposing character was banished in a challenge this turn, draw 2 cards.",
  },
  de: {
    name: "Kartenvorteil",
    text: "Falls in diesem Zug ein gegnerischer Charakter durch eine Herausforderung verbannt wurde, ziehe 2 Karten.",
  },
  fr: {
    name: "Cartes bonus",
    text: "Si un personnage adverse a été banni via un défi ce tour-ci, piochez 2 cartes.",
  },
  it: {
    name: "Vantaggio di Carte",
    text: "Se un personaggio avversario è stato esiliato in una sfida in questo turno, pesca 2 carte.",
  },
  es: {
    name: "Ventaja de la tarjeta",
    text: "Si un personaje contrario fue desterrado en un desafío este turno, roba 2 cartas.",
  },
};
