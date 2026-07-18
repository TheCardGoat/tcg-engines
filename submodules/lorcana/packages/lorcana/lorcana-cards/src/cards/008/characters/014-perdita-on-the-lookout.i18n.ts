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
        title: "Hält Wache",
        description:
          "Solange du mindestens einen Welpen im Spiel hast, erhält dieser Charakter +1 {W}.",
      },
    ],
  },
  fr: {
    name: "Perdita",
    version: "Aux aguets",
    text: [
      {
        title: "Monter la garde",
        description:
          "Tant que vous avez un personnage Chiot en jeu, ce personnage-ci gagne +1 {W}.",
      },
    ],
  },
  it: {
    name: "Peggy",
    version: "Di Vedetta",
    text: [
      {
        title: "Tenere d'Occhio",
        description:
          "Mentre hai in gioco un personaggio Cucciolo, questo personaggio riceve +1 {W}.",
      },
    ],
  },
  es: {
    name: "Perdita",
    version: "Al acecho",
    text: [
      {
        title: "MANTENER VIGILANCIA",
        description:
          "Mientras tengas un personaje Cachorro en juego, este personaje obtiene +1 {W}.",
      },
    ],
  },
};
