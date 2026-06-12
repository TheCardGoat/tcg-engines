import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wildcatsWrenchI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wildcat's Wrench",
    text: [
      {
        title: "REBUILD",
        description: "{E} — Remove up to 2 damage from chosen location.",
      },
    ],
  },
  de: {
    name: "Wildkatz' Schraubenschlüssel",
    text: [
      {
        title: "WIEDERHERSTELLEN",
        description: "— Entferne bis zu 2 Schaden von einem Ort deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Clé de Turbo",
    text: [
      {
        title: "RÉPARATION",
        description: "— Choisissez un Lieu et retirez-lui jusqu'à 2 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Chiave Inglese di Valvola",
    text: [
      {
        title: "RICOSTRUIRE",
        description: "— Rimuovi fino a 2 danni da un luogo a tua scelta.",
      },
    ],
  },
};
