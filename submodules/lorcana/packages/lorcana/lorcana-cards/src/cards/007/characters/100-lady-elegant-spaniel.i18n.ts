import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ladyElegantSpanielI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lady",
    version: "Elegant Spaniel",
    text: [
      {
        title: "A DOG'S LIFE",
        description: "While you have a character named Tramp in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Susi",
    version: "Elegante Spaniel",
    text: [
      {
        title: "Ein Hundeleben",
        description:
          "Solange du mindestens einen Strolch-Charakter im Spiel hast, erhält dieser Charakter +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Lady",
    version: "Épagneule élégante",
    text: [
      {
        title: "Les droits du citoyen chien",
        description:
          "Tant que vous avez un personnage Clochard en jeu, ce personnage-ci gagne +1 {L}.",
      },
    ],
  },
  it: {
    name: "Lilli",
    version: "Elegante Cocker",
    text: [
      {
        title: "La Vita d'Un Cane",
        description:
          "Mentre hai in gioco un personaggio chiamato Biagio, questo personaggio riceve +1 {L}.",
      },
    ],
  },
};
