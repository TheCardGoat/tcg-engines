import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const abuBoldHelmsmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Abu",
    version: "Bold Helmsman",
    text: "Rush",
  },
  de: {
    name: "Abu",
    version: "Mutiger Steuermann",
    text: "Rasant",
  },
  fr: {
    name: "Abu",
    version: "Timonier intrépide",
    text: "Charge",
  },
  it: {
    name: "Abu",
    version: "Timoniere Audace",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
