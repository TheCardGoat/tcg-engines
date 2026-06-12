import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const moanaSelftaughtSailorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Moana",
    version: "Self-Taught Sailor",
    text: [
      {
        title: "LEARNING THE ROPES",
        description: "This character can't challenge unless you have a Captain character in play.",
      },
    ],
  },
  de: {
    name: "Vaiana",
    version: "Autodidaktische Seglerin",
    text: [
      {
        title: "ARBEITET SICH EIN",
        description:
          "Dieser Charakter kann nicht herausfordern, außer du hast mindestens einen Kapitän im Spiel.",
      },
    ],
  },
  fr: {
    name: "Vaiana",
    version: "Navigatrice autodidacte",
    text: [
      {
        title: "APPRENDRE LES FICELLES DU MÉTIER",
        description:
          "Ce personnage ne peut pas défier à moins que vous n'ayez un personnage Capitaine en jeu.",
      },
    ],
  },
  it: {
    name: "Vaiana",
    version: "Marinaia Autodidatta",
    text: [
      {
        title: "IMPARARE LE BASI",
        description:
          "Questo personaggio non può sfidare a meno che tu non abbia in gioco un personaggio Capitano.",
      },
    ],
  },
};
