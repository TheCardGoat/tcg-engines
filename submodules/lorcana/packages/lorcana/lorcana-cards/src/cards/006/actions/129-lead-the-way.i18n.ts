import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const leadTheWayI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lead the Way",
    text: "Your characters get +2 {S} this turn.",
  },
  de: {
    name: "Den Weg weisen",
    text: "Deine Charaktere erhalten in diesem Zug +2.",
  },
  fr: {
    name: "Montrer la voie",
    text: "Vos personnages gagnent +2 pour le reste de ce tour.",
  },
  it: {
    name: "Fare Strada",
    text: [
      {
        title: "I",
        description: "tuoi personaggi ricevono +2 per questo turno.",
      },
    ],
  },
};
