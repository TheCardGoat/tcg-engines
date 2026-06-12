import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const halfHexwellCrownEpicI18n: Record<Languages, I18nProperties> = {
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
        title: "UNERWARTETER FUND, 2",
        description: "— Ziehe 1 Karte.",
      },
      {
        title: "GEFÄHRLICHE MACHT,",
        description: "2, Wirf 1 Karte ab — Erschöpfe einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Moitié de la Couronne d'Hexasort",
    text: [
      {
        title: "TROUVAILLE INATTENDUE, 2",
        description: "— Piochez une carte.",
      },
      {
        title: "UN POUVOIR",
        description: "PÉRILLEUX, 2, Défaussez une carte — Choisissez un personnage et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Mezza Corona Esamantica",
    text: [
      {
        title: "UN RITROVAMENTO INASPETTATO, 2",
        description: "— Pesca una carta.",
      },
      {
        title: "UN POTERE RISCHIOSO, 2,",
        description: "scarta una carta — Impegna un personaggio a tua scelta.",
      },
    ],
  },
};
