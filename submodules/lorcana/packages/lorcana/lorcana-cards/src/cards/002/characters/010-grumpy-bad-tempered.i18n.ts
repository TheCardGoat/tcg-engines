import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const grumpyBadtemperedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Grumpy",
    version: "Bad-Tempered",
    text: [
      {
        title: "THERE'S TROUBLE A-BREWIN'",
        description: "Your other Seven Dwarfs characters get +1 {S}.",
      },
    ],
  },
  de: {
    name: "Brummbär",
    version: "Schlecht gelaunt",
    text: [
      {
        title: "UNS STEHT UNHEIL BEVOR",
        description: "Deine anderen Sieben Zwerge erhalten +1.",
      },
    ],
  },
  fr: {
    name: "Grincheux",
    version: "Sale caractère",
    text: [
      {
        title: "IL Y A QUELQUE CHOSE DE LOUCHE",
        description: "Vos autres personnages Sept Nains gagnent +1.",
      },
    ],
  },
  it: {
    name: "Grumpy",
    version: "Bad-Tempered",
    text: "There's Trouble A-Brewin'\\ Your other Seven Dwarfs characters get +1.",
  },
};
