import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tiggerOneOfAKindI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tigger",
    version: "One of a Kind",
    text: [
      {
        title: "ENERGETIC",
        description: "Whenever you play an action, this character gets +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Tigger",
    version: "Einzigartig",
    text: [
      {
        title: "VOLLER ENERGIE",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Tigrou",
    version: "Unique en son genre",
    text: [
      {
        title: "ÉNERGIQUE",
        description:
          "Chaque fois que vous jouez une carte Action, ce personnage gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tigger",
    version: "One of a Kind",
    text: [
      {
        title: "ENERGETIC",
        description: "Whenever you play an action, this character gets +2 this turn.",
      },
    ],
  },
};
