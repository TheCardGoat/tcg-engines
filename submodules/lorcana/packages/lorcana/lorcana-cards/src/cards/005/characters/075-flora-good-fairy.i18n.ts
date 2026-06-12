import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const floraGoodFairyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flora",
    version: "Good Fairy",
    text: [
      {
        title: "FIDDLE FADDLE",
        description: "While being challenged, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Flora",
    version: "Gute Fee",
    text: [
      {
        title: "HAB ICH EINE WUT!",
        description: "Während dieser Charakter herausgefordert wird, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Flora",
    version: "Bonne fée",
    text: [
      {
        title: "CELA NE RIME À RIEN",
        description: "Lorsqu'il est défié, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Flora",
    version: "Buona Fata",
    text: [
      {
        title: "RIDICOLAGGINE",
        description: "Mentre viene sfidato, questo personaggio riceve +2.",
      },
    ],
  },
};
