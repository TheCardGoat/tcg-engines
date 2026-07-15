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
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Naseweis-Charaktere auszuspielen.)",
      },
      {
        title: "Harmlose Ablenkung",
        description:
          "Wenn du diesen Charakter ausspielst, erschöpfe einen gegnerischen Charakter deiner Wahl mit 2 oder weniger {S}.",
      },
    ],
  },
  fr: {
    name: "La Fée Clochette",
    version: "Fée capricieuse",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé La Fée Clochette.)",
      },
      {
        title: "Diversion inoffensive",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse ayant 2 {S} ou moins et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Trilli",
    version: "Fata Capricciosa",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Trilli.)",
      },
      {
        title: "Innocua Distrazione",
        description:
          "Quando giochi questo personaggio, impegna un personaggio avversario a tua scelta con 2 {S} o inferiore.",
      },
    ],
  },
};
