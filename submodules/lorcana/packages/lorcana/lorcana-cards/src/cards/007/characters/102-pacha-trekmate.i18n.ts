import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pachaTrekmateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pacha",
    version: "Trekmate",
    text: [
      {
        title: "FULL PACK",
        description:
          "While you have more cards in your hand than each opponent, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Patcha",
    version: "Wanderkumpan",
    text: [
      {
        title: "VOLLES GEPÄCK",
        description:
          "Solange du mehr Karten als jede gegnerische Person auf der Hand hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Pacha",
    version: "Compagnon de randonnée",
    text: [
      {
        title: "SAC PLEIN À CRAQUER",
        description:
          "Tant que vous avez plus de cartes en main que chacun de vos adversaires, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Pacha",
    version: "Compagno di Cammino",
    text: [
      {
        title: "ZAINO PIENO",
        description:
          "Mentre hai in mano più carte di ogni avversario, questo personaggio riceve +2.",
      },
    ],
  },
};
