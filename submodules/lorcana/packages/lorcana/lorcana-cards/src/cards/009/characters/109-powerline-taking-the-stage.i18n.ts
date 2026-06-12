import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const powerlineTakingTheStageI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Powerline",
    version: "Taking the Stage",
    text: "Singer 4",
  },
  de: {
    name: "Powerline",
    version: "Auf der Bühne",
    text: [
      {
        title: "Singen 4",
        description: "(Die Kosten dieses Charakters gelten als 4 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Powerline",
    version: "Montant sur scène",
    text: "Mélomane 4 (Ce personnage est considéré comme ayant un coût de 4 pour chanter des chansons.)",
  },
  it: {
    name: "Powerline",
    version: "Sul Palco",
    text: "Melodioso 4",
  },
};
