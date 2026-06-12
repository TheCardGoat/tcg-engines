import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const perditaOnTheLookoutI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Perdita",
    version: "On the Lookout",
    text: [
      {
        title: "KEEPING WATCH",
        description: "While you have a Puppy character in play, this character gets +1 {W}.",
      },
    ],
  },
  de: {
    name: "Perdi",
    version: "Auf der Lauer",
    text: [
      {
        title: "HÄLT WACHE",
        description:
          "Solange du mindestens einen Welpen im Spiel hast, erhält dieser Charakter +1.",
      },
    ],
  },
  fr: {
    name: "Perdita",
    version: "Aux aguets",
    text: [
      {
        title: "MONTER LA GARDE",
        description: "Tant que vous avez un personnage Chiot en jeu, ce personnage-ci gagne +1.",
      },
    ],
  },
  it: {
    name: "Peggy",
    version: "Di Vedetta",
    text: [
      {
        title: "TENERE D'OCCHIO",
        description: "Mentre hai in gioco un personaggio Cucciolo, questo personaggio riceve +1.",
      },
    ],
  },
};
