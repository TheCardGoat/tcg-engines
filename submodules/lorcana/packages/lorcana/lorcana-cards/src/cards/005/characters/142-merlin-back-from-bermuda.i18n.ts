import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinBackFromBermudaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Back from Bermuda",
    text: [
      {
        title: "LONG LIVE THE KING!",
        description: "Your characters named Arthur gain Resist +1.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Zurück von den Bermudas",
    text: [
      {
        title: "LANG LEBE DER KÖNIG!",
        description:
          "Deine Arthur-Charaktere erhalten Robust +1 (Reduziere jeglichen Schaden, der ihnen zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "De retour de Saint-Trop'",
    text: [
      {
        title: "VIVE LE ROI ARTHUR!",
        description: "Vos personnages Arthur gagnent Résistance +1.",
      },
    ],
  },
  it: {
    name: "Merlino",
    version: "Tornato da Honolulu",
    text: [
      {
        title: "EVVIVA IL RE!",
      },
      {
        title: "I",
        description: "tuoi personaggi chiamati Artù ottengono Resistere +1.",
      },
    ],
  },
};
