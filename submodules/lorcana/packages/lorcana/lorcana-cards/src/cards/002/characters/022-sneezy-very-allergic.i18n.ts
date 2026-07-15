import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sneezyVeryAllergicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sneezy",
    version: "Very Allergic",
    text: [
      {
        title: "AH-CHOO!",
        description:
          "Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Hatschi",
    version: "Äußerst allergisch",
    text: [
      {
        title: "Hatschi!",
        description:
          "Wenn du diesen Charakter ausspielst und jedes Mal, wenn du einen anderen der Sieben Zwerge ausspielst, darfst du einem Charakter deiner Wahl in diesem Zug -1 {S} geben.",
      },
    ],
  },
  fr: {
    name: "Atchoum",
    version: "Très allergique",
    text: [
      {
        title: "Aaa...tchoum!",
        description:
          "Lorsque vous jouez ce personnage ou un autre personnage Sept Nains, choisissez un personnage qui subit -1 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Sneezy",
    version: "Very Allergic",
    text: "Ah-choo!\\ Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.",
  },
};
