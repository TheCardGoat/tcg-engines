import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckSleepwalkerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Sleepwalker",
    text: [
      {
        title: "STARTLED AWAKE",
        description: "Whenever you play an action, this character gets +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Schlafwandler",
    text: [
      {
        title: "AUFSCHRECKEN",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Somnambule",
    text: [
      {
        title: "RÉVEIL EN SURSAUT",
        description:
          "Chaque fois que vous jouez une carte Action, ce personnage gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Donald Duck",
    version: "Sleepwalker",
    text: [
      {
        title: "STARTLED AWAKE",
        description: "Whenever you play an action, this character gets +2 this turn.",
      },
    ],
  },
};
