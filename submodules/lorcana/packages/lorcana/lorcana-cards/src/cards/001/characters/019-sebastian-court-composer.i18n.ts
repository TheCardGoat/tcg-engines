import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sebastianCourtComposerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sebastian",
    version: "Court Composer",
    text: "Singer 4",
  },
  de: {
    name: "Sebastian",
    version: "Hofkomponist",
    text: [
      {
        title: "Singen 4",
        description: "(Die Kosten dieses Charakters gelten als 4 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "SÉBASTIEN",
    version: "Compositeur à la Cour",
    text: "Mélomane 4 (Ce personnage est considéré comme ayant un coût de 4 pour chanter des chansons.)",
  },
  it: {
    name: "Sebastian",
    version: "Compositore di Corte",
    text: "Melodioso 4",
  },
};
