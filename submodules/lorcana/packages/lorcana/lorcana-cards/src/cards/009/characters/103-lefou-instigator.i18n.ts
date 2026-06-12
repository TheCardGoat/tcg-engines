import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lefouInstigatorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "LeFou",
    version: "Instigator",
    text: [
      {
        title: "FAN THE FLAMES",
        description:
          "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      },
    ],
  },
  de: {
    name: "Le Fou",
    version: "Anstifter",
    text: [
      {
        title: "ENTFACHT DAS FEUER!",
        description:
          "Wenn du diesen Charakter ausspielst, mache einen Charakter deiner Wahl bereit. Er kann in diesem Zug nicht mehr erkunden.",
      },
    ],
  },
  fr: {
    name: "LE FOU",
    version: "Agitateur de foule",
    text: [
      {
        title: "ATTISER LES FLAMMES",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage et redressez-le. Celui-ci ne peut pas être envoyé à l'aventure pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "LeFou",
    version: "Instigator",
    text: [
      {
        title: "FAN THE FLAMES",
        description:
          "When you play this character, ready chosen character. They can't quest for the rest of this turn.",
      },
    ],
  },
};
