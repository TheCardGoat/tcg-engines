import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinkerBellTemperamentalFairyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tinker Bell",
    version: "Temperamental Fairy",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "HARMLESS DIVERSION",
        description:
          "When you play this character, exert chosen opposing character with 2 {S} or less.",
      },
    ],
  },
  de: {
    name: "Naseweis",
    version: "Temperamentvolle Fee",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "HARMLOSE ABLENKUNG",
        description:
          "Wenn du diesen Charakter ausspielst, erschöpfe einen gegnerischen Charakter deiner Wahl mit 2 oder weniger.",
      },
    ],
  },
  fr: {
    name: "La Fée Clochette",
    version: "Fée capricieuse",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "DIVERSION INOFFENSIVE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse ayant 2 ou moins et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Trilli",
    version: "Fata Capricciosa",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "INNOCUA DISTRAZIONE",
        description:
          "Quando giochi questo personaggio, impegna un personaggio avversario a tua scelta con 2 o inferiore.",
      },
    ],
  },
};
