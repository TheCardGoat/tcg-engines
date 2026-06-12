import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ursulaVanessaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ursula",
    version: "Vanessa",
    text: "Singer 4",
  },
  de: {
    name: "Ursula",
    version: "Vanessa",
    text: [
      {
        title: "Singen 4",
        description: "(Die Kosten dieses Charakters gelten als 4 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Ursula",
    version: "Vanessa",
    text: "Mélomane 4 (Ce personnage est considéré comme ayant un coût de 4 pour chanter des chansons.)",
  },
  it: {
    name: "Ursula",
    version: "Vanessa",
    text: "Melodioso 4",
  },
};
