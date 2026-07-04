import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const brooklynSecondInCommandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Brooklyn",
    version: "Second in Command",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Brooklyn",
    version: "Zweiter Befehlshaber",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Am Tage aus Stein",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Brooklyn",
    version: "Bras droit",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Statue le jour",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Brooklyn",
    version: "Secondo in Comando",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Statue di Giorno",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
