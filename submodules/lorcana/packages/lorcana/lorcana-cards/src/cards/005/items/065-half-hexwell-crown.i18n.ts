import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const halfHexwellCrownI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Half Hexwell Crown",
    text: [
      {
        title: "AN UNEXPECTED FIND",
        description: "{E}, 2 {I} — Draw a card.",
      },
      {
        title: "A PERILOUS POWER",
        description: "{E}, 2 {I}, Discard a card — Exert chosen character.",
      },
    ],
  },
  de: {
    name: "Hälfte der Hexwell-Krone",
    text: [
      {
        title: "Unerwarteter Fund",
        description: "{E}, 2 {I} — Ziehe 1 Karte.",
      },
      {
        title: "Gefährliche Macht",
        description: "{E}, 2 {I}, Wirf 1 Karte ab — Erschöpfe einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Moitié de la Couronne d'Hexasort",
    text: [
      {
        title: "Trouvaille inattendue",
        description: "{E}, 2 {I} — Piochez une carte.",
      },
      {
        title: "Un pouvoir périlleux",
        description: "{E}, 2 {I}, Défaussez une carte — Choisissez un personnage et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Mezza Corona Esamantica",
    text: [
      {
        title: "Un Ritrovamento Inaspettato",
        description: "{E}, 2 {I} — Pesca una carta.",
      },
      {
        title: "Un Potere Rischioso",
        description: "{E}, 2 {I}, scarta una carta — Impegna un personaggio a tua scelta.",
      },
    ],
  },
};
