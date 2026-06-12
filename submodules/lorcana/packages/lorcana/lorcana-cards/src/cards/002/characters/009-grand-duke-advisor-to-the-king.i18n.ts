import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grandDukeAdvisorToTheKingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grand Duke",
    version: "Advisor to the King",
    text: [
      {
        title: "YES, YOUR MAJESTY",
        description: "Your Prince, Princess, King, and Queen characters get +1 {S}.",
      },
    ],
  },
  de: {
    name: "Großherzog",
    version: "Berater des Königs",
    text: [
      {
        title: "JA, EUER MAJESTÄT",
        description: "Deine Prinzessinnen, Prinzen, Königinnen und Könige erhalten +1.",
      },
    ],
  },
  fr: {
    name: "Grand Duke",
    version: "Conseiller du roi",
    text: [
      {
        title: "OUI, VOTRE MAJESTÉ",
        description: "Vos personnages Princesse, Prince, Reine et Roi gagnent +1.",
      },
    ],
  },
  it: {
    name: "Grand Duke",
    version: "Advisor to the King",
    text: [
      {
        title: "YES, YOUR MAJESTY",
        description: "Your Prince, Princess, King, and Queen characters get +1.",
      },
    ],
  },
};
