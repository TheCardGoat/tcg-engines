import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const auroraDreamingGuardianI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aurora",
    version: "Dreaming Guardian",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "PROTECTIVE EMBRACE",
        description: "Your other characters gain Ward.",
      },
    ],
  },
  de: {
    name: "Aurora",
    version: "Wächterin der Träume",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "SCHÜTZENDE UMARMUNG",
        description:
          "Deine anderen Charaktere erhalten Behütet. (Gegnerische Karten können diese Charaktere nicht auswählen, außer um sie herauszufordern.)",
      },
    ],
  },
  fr: {
    name: "AURORE",
    version: "Gardienne rêveuse",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "ÉTREINTE PROTECTRICE",
        description:
          "Vos autres personnages gagnent Hors d'atteinte. (Ils ne peuvent pas être choisis par vos adversaires, hormis pour un défi.)",
      },
    ],
  },
  it: {
    name: "Aurora",
    version: "Dreaming Guardian",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "PROTECTIVE EMBRACE",
        description:
          "Your other characters gain Ward. (Opponents can't choose them except to challenge.)",
      },
    ],
  },
};
