import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sardineCanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sardine Can",
    text: [
      {
        title: "FLIGHT CABIN",
        description: "Your exerted characters gain Ward.",
      },
    ],
  },
  de: {
    name: "Sardinenbüchse",
    text: [
      {
        title: "FLUGKABINE",
        description:
          "Deine erschöpften Charaktere erhalten Behütet. (Gegnerische Karten können die Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "Boîte de sardines",
    text: [
      {
        title: "CABINE DE VOL",
        description:
          "Vos personnages épuisés gagnent Hors d'atteinte. (Ils ne peuvent pas être choisis par vos adversaires, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Sardine Can",
    text: [
      {
        title: "FLIGHT CABIN",
        description:
          "Your exerted characters gain Ward. (Opponents can't choose them except to challenge.)",
      },
    ],
  },
};
