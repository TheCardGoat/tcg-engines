import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const marchHareAbsurdHostI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "March Hare",
    version: "Absurd Host",
    text: "Rush",
  },
  de: {
    name: "Der Märzhase",
    version: "Alberner Gastgeber",
    text: "Rasant",
  },
  fr: {
    name: "Le Lièvre de Mars",
    version: "Hôte absurde",
    text: "Charge",
  },
  it: {
    name: "Leprotto Bisestile",
    version: "Ospite Assurdo",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
