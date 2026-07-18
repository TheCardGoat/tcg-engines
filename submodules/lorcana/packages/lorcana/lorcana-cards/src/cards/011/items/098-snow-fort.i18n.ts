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
        title: "Vorteilhafte Lage",
        description: "Deine Charaktere erhalten +1 {S}.",
      },
      {
        title: "Barrikade",
        description:
          "Deine Charaktere erhalten im Zug einer gegnerischen Person <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Fort de neige",
    text: [
      {
        title: "Position avantageuse",
        description: "Vos personnages gagnent +1 {S}.",
      },
      {
        title: "Barricade",
        description: "Durant le tour de vos adversaires, vos personnages gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Fortino di Neve",
    text: [
      {
        title: "Posizione di Vantaggio",
        description: "I tuoi personaggi ricevono +1 {S}.",
      },
      {
        title: "Barricata",
        description: "Durante i turni degli avversari, i tuoi personaggi ottengono <Resistere> +1.",
      },
    ],
  },
  es: {
    name: "Fuerte de nieve",
    text: [
      {
        title: "EL TERRENO ALTO",
        description: "Tus personajes obtienen +1 {S}.",
      },
      {
        title: "BARRICADA",
        description: "Durante los turnos de los oponentes, tus personajes obtienen Resistencia +1.",
      },
    ],
  },
};
