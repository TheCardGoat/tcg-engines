import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const snowFortI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Snow Fort",
    text: [
      {
        title: "THE HIGH GROUND",
        description: "Your characters get +1 {S}.",
      },
      {
        title: "BARRICADE",
        description: "During opponents' turns, your characters gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Schneefestung",
    text: [
      {
        title: "VORTEILHAFTE LAGE",
        description: "Deine Charaktere erhalten +1.",
      },
      {
        title: "BARRIKADE",
        description:
          "Deine Charaktere erhalten im Zug einer gegnerischen Person Robust +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Fort de neige",
    text: [
      {
        title: "POSITION AVANTAGEUSE",
        description: "Vos personnages gagnent +1.",
      },
      {
        title: "BARRICADE",
        description: "Durant le tour de vos adversaires, vos personnages gagnent Résistance +1.",
      },
    ],
  },
  it: {
    name: "Fortino di Neve",
    text: [
      {
        title: "POSIZIONE DI VANTAGGIO I",
        description: "tuoi personaggi ricevono +1.",
      },
      {
        title: "BARRICATA",
        description: "Durante i turni degli avversari, i tuoi personaggi ottengono Resistere +1.",
      },
    ],
  },
};
