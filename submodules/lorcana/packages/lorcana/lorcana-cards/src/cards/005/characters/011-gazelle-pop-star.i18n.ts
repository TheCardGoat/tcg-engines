import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gazellePopStarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gazelle",
    version: "Pop Star",
    text: "Singer 5",
  },
  de: {
    name: "Gazelle",
    version: "Popstar",
    text: [
      {
        title: "Singen 5",
        description: "(Die Kosten dieses Charakters gelten als 5 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Gazelle",
    version: "Pop star",
    text: "Mélomane 5 (Ce personnage est considéré comme ayant un coût de 5 pour chanter des chansons.)",
  },
  it: {
    name: "Gazelle",
    version: "Pop Star",
    text: "Melodioso 5",
  },
};
