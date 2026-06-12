import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lenaSabrewingRebelliousTeenagerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lena Sabrewing",
    version: "Rebellious Teenager",
    text: "Rush",
  },
  de: {
    name: "Lena Degenflügel",
    version: "Rebellischer Teenager",
    text: "Rasant",
  },
  fr: {
    name: "Lena de Sortilège",
    version: "Adolescente rebelle",
    text: "Charge",
  },
  it: {
    name: "Lena Sabrewing",
    version: "Adolescente Ribelle",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
