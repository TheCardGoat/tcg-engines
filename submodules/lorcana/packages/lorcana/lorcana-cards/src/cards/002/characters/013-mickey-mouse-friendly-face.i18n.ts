import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseFriendlyFaceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Friendly Face",
    text: [
      {
        title: "GLAD YOU'RE HERE!",
        description:
          "Whenever this character quests, you pay 3 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Freundliches Gesicht",
    text: [
      {
        title: "SCHÖN, DASS DU DA BIST!",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, zahlst du 3 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Visage amical",
    text: [
      {
        title: "BIENVENUE DANS MA MAISON",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, le prochain personnage que vous jouez durant ce tour vous coûte 3 de moins.",
      },
    ],
  },
  it: {
    name: "Mickey Mouse",
    version: "Friendly Face",
    text: [
      {
        title: "GLAD YOU'RE HERE!",
        description:
          "Whenever this character quests, you pay 3 less for the next character you play this turn.",
      },
    ],
  },
};
