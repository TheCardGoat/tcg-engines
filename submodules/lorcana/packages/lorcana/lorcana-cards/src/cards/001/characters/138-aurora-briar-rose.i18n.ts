import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const auroraBriarRoseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aurora",
    version: "Briar Rose",
    text: [
      {
        title: "DISARMING BEAUTY",
        description: "When you play this character, chosen character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Aurora",
    version: "Röschen",
    text: [
      {
        title: "ENTWAFFNENDE SCHÖNHEIT",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem Charakter deiner Wahl in diesem Zug -2.",
      },
    ],
  },
  fr: {
    name: "AURORE",
    version: "Rose",
    text: [
      {
        title: "BEAUTÉ DÉCONCERTANTE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui subit -2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Aurora",
    version: "Briar Rose",
    text: [
      {
        title: "DISARMING BEAUTY",
        description: "When you play this character, chosen character gets –2 this turn.",
      },
    ],
  },
};
