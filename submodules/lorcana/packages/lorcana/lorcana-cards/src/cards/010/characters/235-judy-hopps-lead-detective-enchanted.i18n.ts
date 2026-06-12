import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const judyHoppsLeadDetectiveEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Judy Hopps",
    version: "Lead Detective",
    text: [
      {
        title: "Shift 4 {I}",
      },
      {
        title: "LATERAL THINKING",
        description: "During your turn, your Detective characters gain Alert and Resist +2.",
      },
    ],
  },
  de: {
    name: "Judy Hopps",
    version: "Hauptkommissarin",
    text: [
      {
        title: "Gestaltwandel 4",
      },
      {
        title: "LATERALES DENKEN",
        description:
          "In deinem Zug erhalten deine Detektive Alarmiert und Robust +2. (Sie können herausfordern, als hätten sie Wendig. Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Judy Hopps",
    version: "Détective en charge",
    text: [
      {
        title: "Alter 4",
      },
      {
        title: "PENSÉE LATÉRALE",
        description:
          "Durant votre tour, vos personnages Détective gagnent Agilité et Résistance +2.",
      },
    ],
  },
  it: {
    name: "Judy Hopps",
    version: "Capo Detective",
    text: [
      {
        title: "Trasformazione 4",
      },
      {
        title: "PENSIERO LATERALE",
        description:
          "Durante il tuo turno, i tuoi personaggi Detective ottengono Vigile e Resistere +2.",
      },
    ],
  },
};
