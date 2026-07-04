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
        title: "Manch einer gebraucht seine Fantasie",
        description:
          "Solange mindestens eine gegnerische Person keine Handkarten hat, erhält dieser Charakter +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Belle",
    version: "Rat de bibliothèque",
    text: [
      {
        title: "Utilisez votre imagination",
        description:
          "Tant qu'un adversaire n'a plus de cartes en main, ce personnage gagne +2 {L}.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Bookworm",
    text: [
      {
        title: "Use Your Imagination",
        description: "While an opponent has no cards in their hand, this character gets +2 {L}.",
      },
    ],
  },
};
