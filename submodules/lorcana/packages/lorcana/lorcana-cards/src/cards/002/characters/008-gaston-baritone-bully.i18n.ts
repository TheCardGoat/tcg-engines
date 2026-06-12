import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gastonBaritoneBullyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gaston",
    version: "Baritone Bully",
    text: "Singer 5",
  },
  de: {
    name: "Gaston",
    version: "Bariton-Bully",
    text: [
      {
        title: "Singen 5",
        description: "(Die Kosten dieses Charakters gelten als 5 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Gaston",
    version: "Brute et baryton",
    text: "Mélomane 5 (Ce personnage est considéré comme ayant un coût de 5 pour chanter des chansons.)",
  },
  it: {
    name: "Gaston",
    version: "Baritone Bully",
    text: [
      {
        title: "Singer 5",
        description: "(This character counts as cost 5 to sing songs.)",
      },
    ],
  },
};
