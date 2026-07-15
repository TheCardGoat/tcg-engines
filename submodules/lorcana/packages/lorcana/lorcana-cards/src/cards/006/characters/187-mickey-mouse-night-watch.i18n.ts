import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseNightWatchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Night Watch",
    text: [
      {
        title: "SUPPORT",
        description: "Your Pluto characters get Resist +1.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Nachtwächter",
    text: [
      {
        title: "Unterstützung",
        description:
          "Deine Pluto-Charaktere erhalten <Robust> +1. (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Veilleur de nuit",
    text: [
      {
        title: "Renfort",
        description: "Vos personnages Pluto gagnent <Résistance> +1.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Sentinella Notturna",
    text: [
      {
        title: "Scorta",
        description: "I tuoi personaggi chiamati Pluto ottengono <Resistere> +1.",
      },
    ],
  },
};
