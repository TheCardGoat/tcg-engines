import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const shantiVillageGirlI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Shanti",
    version: "Village Girl",
    text: "Singer 5",
  },
  de: {
    name: "Shanti",
    version: "Dorfmädchen",
    text: [
      {
        title: "Singen 5",
        description: "(Die Kosten dieses Charakters gelten als 5 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Shanti",
    version: "Fille du village",
    text: "Mélomane 5 (Ce personnage est considéré comme ayant un coût de 5 pour chanter des chansons.)",
  },
  it: {
    name: "Shanti",
    version: "Ragazza del Villaggio",
    text: "Melodioso 5",
  },
};
