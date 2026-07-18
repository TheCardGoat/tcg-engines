import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dinnerBellI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dinner Bell",
    text: [
      {
        title: "YOU KNOW WHAT HAPPENS",
        description:
          "{E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.",
      },
    ],
  },
  de: {
    name: "Tischglocke",
    text: [
      {
        title: "Du weißt, was passiert",
        description:
          "{E}, 2 {I} — Wähle einen deiner Charaktere und zähle den Schaden auf ihm. Ziehe diese Anzahl an Karten und verbanne den Charakter anschließend.",
      },
    ],
  },
  fr: {
    name: "Clochette du dîner",
    text: [
      {
        title: "Tu sais ce qui se passe",
        description:
          "{E}, 2 {I} — Choisissez l'un de vos personnages blessés et piochez une carte pour chaque jeton Dommage sur lui, puis bannissez-le.",
      },
    ],
  },
  it: {
    name: "Dinner Bell",
    text: [
      {
        title: "You Know What Happens",
        description:
          "{E}, 2 {I} — Draw cards equal to the damage on chosen character of yours, then banish them.",
      },
    ],
  },
  es: {
    name: "Sonido para la comida",
    text: [
      {
        title: "SABES LO QUE PASA",
        description:
          "{E}, 2 {I}: roba cartas equivalentes al daño del personaje tuyo elegido y luego destiérralas.",
      },
    ],
  },
};
