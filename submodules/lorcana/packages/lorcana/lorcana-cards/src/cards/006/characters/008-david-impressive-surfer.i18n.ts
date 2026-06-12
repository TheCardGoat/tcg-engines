import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const davidImpressiveSurferI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "David",
    version: "Impressive Surfer",
    text: [
      {
        title: "SHOWING OFF",
        description: "While you have a character named Nani in play, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "David",
    version: "Eindrucksvoller Surfer",
    text: [
      {
        title: "PROTZEREI",
        description:
          "Solange du mindestens einen Nani-Charakter im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "David",
    version: "Surfeur impressionnant",
    text: [
      {
        title: "FRIMEUR",
        description: "Tant que vous avez un personnage Nani en jeu, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "David",
    version: "Surfista Impressionante",
    text: [
      {
        title: "METTERSI IN MOSTRA",
        description:
          "Mentre hai in gioco un personaggio chiamato Nani, questo personaggio riceve +2.",
      },
    ],
  },
};
