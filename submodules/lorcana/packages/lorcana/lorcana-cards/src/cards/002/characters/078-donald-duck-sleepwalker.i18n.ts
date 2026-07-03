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
        title: "Aufschrecken",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter in diesem Zug +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Somnambule",
    text: [
      {
        title: "Réveil en sursaut",
        description:
          "Chaque fois que vous jouez une carte Action, ce personnage gagne +2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Donald Duck",
    version: "Sleepwalker",
    text: [
      {
        title: "Startled Awake",
        description: "Whenever you play an action, this character gets +2 {S} this turn.",
      },
    ],
  },
};
