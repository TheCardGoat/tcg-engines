import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const absorbingBloomI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Absorbing Bloom",
    text: [
      {
        title: "Metamorphosis",
        description:
          "{E}, 1 {I} — If a character was banished in a challenge this turn, draw a card.",
      },
    ],
  },
  de: {
    name: "Absorbierende Blume",
    text: [
      {
        title: "Metamorphose",
        description:
          "{E}, 1 {I} — Falls in diesem Zug ein Charakter durch eine Herausforderung verbannt wurde, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Fleur absorbante",
    text: [
      {
        title: "Métamorphose",
        description:
          "{E}, 1 {I} — Si un personnage a été banni via un défi ce tour-ci, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Infiorescenza Assorbente",
    text: [
      {
        title: "Metamorfosi",
        description:
          "{E}, 1 {I} — Se un personaggio è stato esiliato in una sfida in questo turno, pesca una carta.",
      },
    ],
  },
};
