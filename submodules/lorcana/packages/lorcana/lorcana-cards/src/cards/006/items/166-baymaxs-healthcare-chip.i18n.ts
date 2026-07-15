import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const baymaxsHealthcareChipI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baymax's Healthcare Chip",
    text: [
      {
        title: "10,000 MEDICAL PROCEDURES",
        description: "{E} — Choose one:",
      },
      {
        title: "* Remove up to 1 damage from chosen character.",
      },
      {
        title:
          "* If you have a Robot character in play, remove up to 3 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Baymax' Gesundheitschip",
    text: [
      {
        title: "10.000 medizinische Verfahren",
        description: "{E} — Wähle eine Möglichkeit aus:",
      },
      {
        title: "• Entferne bis zu 1 Schaden von einem Charakter deiner Wahl.",
      },
      {
        title:
          "• Wenn du mindestens einen Roboter im Spiel hast, entferne bis zu 3 Schaden von einem Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Puce de soins de Baymax",
    text: [
      {
        title: "10 000 procédures médicales",
        description: "{E} — Choisissez entre:",
      },
      {
        title: "• Choisissez un personnage et retirez-lui jusqu'à 1 dommage.",
      },
      {
        title:
          "• Si vous avez un personnage Robot en jeu, choisissez un personnage et retirez-lui jusqu'à 3 dommages.",
      },
    ],
  },
  it: {
    name: "Microchip Sanitario di Baymax",
    text: [
      {
        title: "10.000 Procedure Mediche",
        description: "{E} — Scegli uno:",
      },
      {
        title: "• Rimuovi fino a 1 danno da un personaggio a tua scelta.",
      },
      {
        title:
          "• Se hai in gioco un personaggio Robot, rimuovi fino a 3 danni da un personaggio a tua scelta.",
      },
    ],
  },
};
