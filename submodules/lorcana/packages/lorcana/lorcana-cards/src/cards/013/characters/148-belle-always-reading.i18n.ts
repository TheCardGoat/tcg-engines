import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const belleAlwaysReadingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle",
    version: "Always Reading",
    text: [
      {
        title: "Dreaming of More",
        description: "You pay 1 {I} less to shift a character on top of this character.",
      },
    ],
  },
  de: {
    name: "Belle",
    version: "Liest immer",
    text: [
      {
        title: "Träumt von mehr",
        description:
          "Du zahlst 1 {I} weniger, um einen Charakter auf diesen Charakter zu gestaltwandeln.",
      },
    ],
  },
  fr: {
    name: "Belle",
    version: "Toujours en train de lire",
    text: [
      {
        title: "Rêve de mieux",
        description:
          "Jouer un personnage sur ce personnage-ci via une capacité Alter vous coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Sempre a Leggere",
    text: [
      {
        title: "Sognando di Meglio",
        description:
          "Paga 1 {I} in meno per trasformare un personaggio sopra a questo personaggio.",
      },
    ],
  },
};
