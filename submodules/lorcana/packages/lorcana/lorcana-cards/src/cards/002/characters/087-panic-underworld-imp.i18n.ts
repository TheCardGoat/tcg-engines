import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const panicUnderworldImpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Panic",
    version: "Underworld Imp",
    text: [
      {
        title: "I CAN HANDLE IT",
        description:
          "When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
      },
    ],
  },
  de: {
    name: "Schwefel",
    version: "Schelm der Unterwelt",
    text: [
      {
        title: "ALLES IM GRÜNEN BEREICH",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem Charakter deiner Wahl in diesem Zug +2. Wählst du einen Pech-Charakter, gib ihm in diesem Zug stattdessen +4.",
      },
    ],
  },
  fr: {
    name: "Panique",
    version: "Diablotin des Enfers",
    text: [
      {
        title: "ÇA VA ALLER",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage, il gagne +2 pour le reste de ce tour. Si c'est un personnage Peine, il gagne +4 à la place.",
      },
    ],
  },
  it: {
    name: "Panic",
    version: "Underworld Imp",
    text: [
      {
        title: "I CAN HANDLE IT",
        description:
          "When you play this character, chosen character gets +2 this turn. If the chosen character is named Pain, he gets +4 instead.",
      },
    ],
  },
};
