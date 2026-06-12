import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thePhantomBlotShadowyFigureI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Phantom Blot",
    version: "Shadowy Figure",
    text: "Rush",
  },
  de: {
    name: "Das Phantom",
    version: "Schattenhafte Gestalt",
    text: "Rasant",
  },
  fr: {
    name: "Le Fantôme Noir",
    version: "Figure de l'ombre",
    text: "Charge",
  },
  it: {
    name: "Macchia Nera",
    version: "Figura Misteriosa",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
