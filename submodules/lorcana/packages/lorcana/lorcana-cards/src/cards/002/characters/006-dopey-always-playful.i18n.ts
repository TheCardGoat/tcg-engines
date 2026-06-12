import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dopeyAlwaysPlayfulI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dopey",
    version: "Always Playful",
    text: [
      {
        title: "ODD ONE OUT",
        description:
          "When this character is banished, your other Seven Dwarfs characters get +2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Seppl",
    version: "Immer verspielt",
    text: "Sonderling\\ Wenn dieser Charakter verbannt wird, erhalten deine anderen Sieben Zwerge bis zu Beginn deines nächsten Zuges +2.",
  },
  fr: {
    name: "Simplet",
    version: "Toujours enjoué",
    text: [
      {
        title: "UN CAS À PART",
        description:
          "Lorsque ce personnage est banni, vos autres personnages Sept Nains gagnent +2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Dopey",
    version: "Always Playful",
    text: "Odd One Out\\ When this character is banished, your other Seven Dwarfs characters get +2 until the start of your next turn.",
  },
};
