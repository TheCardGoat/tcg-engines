import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const belleBookwormI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle",
    version: "Bookworm",
    text: [
      {
        title: "USE YOUR IMAGINATION",
        description: "While an opponent has no cards in their hand, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Belle",
    version: "Bücherwurm",
    text: [
      {
        title: "MANCH EINER GEBRAUCHT SEINE FANTASIE",
        description:
          "Solange mindestens eine gegnerische Person keine Handkarten hat, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Belle",
    version: "Rat de bibliothèque",
    text: [
      {
        title: "UTILISEZ VOTRE IMAGINATION",
        description: "Tant qu'un adversaire n'a plus de cartes en main, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Bookworm",
    text: [
      {
        title: "USE YOUR IMAGINATION",
        description: "While an opponent has no cards in their hand, this character gets +2.",
      },
    ],
  },
};
