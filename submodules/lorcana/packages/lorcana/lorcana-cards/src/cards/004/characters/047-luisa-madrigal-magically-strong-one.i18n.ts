import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const luisaMadrigalMagicallyStrongOneI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Luisa Madrigal",
    version: "Magically Strong One",
    text: "Rush",
  },
  de: {
    name: "Luisa Madrigal",
    version: "Magisch stark",
    text: "Rasant",
  },
  fr: {
    name: "Luisa Madrigal",
    version: "Magiquement forte",
    text: "Charge",
  },
  it: {
    name: "Luisa Madrigal",
    version: "Magicamente Forzuta",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
