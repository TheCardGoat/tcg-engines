import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const broadwaySturdyAndStrongI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Broadway",
    version: "Sturdy and Strong",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Broadway",
    version: "Robust und stark",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "AM TAGE AUS STEIN",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Broadway",
    version: "Fort et robuste",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "STATUE LE JOUR",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Broadway",
    version: "Robusto e Forte",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "STATUE DI GIORNO",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
