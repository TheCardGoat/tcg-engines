import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bronxFerociousBeastI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bronx",
    version: "Ferocious Beast",
    text: [
      {
        title: "Reckless",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Bronx",
    version: "Grausame Bestie",
    text: [
      {
        title: "Impulsiv",
      },
      {
        title: "AM TAGE AUS STEIN",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Bronx",
    version: "Bête féroce",
    text: [
      {
        title: "Combattant",
      },
      {
        title: "STATUE LE JOUR",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Bronx",
    version: "Bestia Feroce",
    text: [
      {
        title: "Attaccabrighe",
      },
      {
        title: "STATUE DI GIORNO",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
