import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cogsworthGrandfatherClockI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cogsworth",
    version: "Grandfather Clock",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Ward",
      },
      {
        title: "UNWIND",
        description: "Your other characters gain Resist +1",
      },
    ],
  },
  de: {
    name: "Von Unruh",
    version: "Standuhr",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "Behütet",
      },
      {
        title: "ENTSCHLEUNIGEN",
        description:
          "Deine anderen Charaktere erhalten Robust +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Big Ben",
    version: "Grand-père Horloge",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "Hors d'atteinte",
      },
      {
        title: "REPOSÉ",
        description: "Vos autres personnages gagnent Résistance +1.",
      },
    ],
  },
  it: {
    name: "Cogsworth",
    version: "Grandfather Clock",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Ward",
      },
      {
        title: "UNWIND",
        description: "Your other characters gain Resist +1 (Damage dealt to them is reduced by 1.)",
      },
    ],
  },
};
