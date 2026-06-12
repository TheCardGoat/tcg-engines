import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lexingtonSmallInStatureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lexington",
    version: "Small in Stature",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Lexington",
    version: "Von kleiner Statur",
    text: [
      {
        title: "Alarmiert",
        description: "(Dieser Charakter kann herausfordern, als hätte er Wendig.)",
      },
      {
        title: "AM TAGE AUS STEIN",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Lexington",
    version: "De petite stature",
    text: [
      {
        title: "Agilité (Ce personnage peut défier comme s'il avait Insaisissable.)",
      },
      {
        title: "STATUE LE JOUR",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Lexington",
    version: "Piccoletto",
    text: [
      {
        title: "Vigile",
        description: "(Questo personaggio può sfidare come se avesse Sfuggente.)",
      },
      {
        title: "STATUE DI GIORNO",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
