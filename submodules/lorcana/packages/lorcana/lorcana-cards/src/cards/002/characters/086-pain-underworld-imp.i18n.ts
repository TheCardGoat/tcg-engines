import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const painUnderworldImpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pain",
    version: "Underworld Imp",
    text: [
      {
        title: "COMING, YOUR MOST LUGUBRIOUSNESS",
        description: "While this character has 5 {S} or more, he gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Pech",
    version: "Schelm der Unterwelt",
    text: [
      {
        title: "ICH KOMME, EURE DÜSTERE VERBROCHENHEIT",
        description: "Solange dieser Charakter 5 oder mehr hat, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Peine",
    version: "Diablotin des Enfers",
    text: [
      {
        title: "JE VIENS, VOTRE LUGUBRE NOIRCEUR",
        description: "Tant que ce personnage a au moins 5, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Pain",
    version: "Underworld Imp",
    text: [
      {
        title: "COMING, YOUR MOST LUGUBRIOUSNESS",
        description: "While this character has 5 or more, he gets +2.",
      },
    ],
  },
};
