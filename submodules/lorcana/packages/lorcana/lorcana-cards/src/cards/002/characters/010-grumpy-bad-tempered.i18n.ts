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
        title: "Uns steht Unheil bevor",
        description: "Deine anderen Sieben Zwerge erhalten +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Grincheux",
    version: "Sale caractère",
    text: [
      {
        title: "Il y a quelque chose de louche",
        description: "Vos autres personnages Sept Nains gagnent +1 {S}.",
      },
    ],
  },
  it: {
    name: "Grumpy",
    version: "Bad-Tempered",
    text: "There's Trouble A-Brewin'\\ Your other Seven Dwarfs characters get +1 {S}.",
  },
  es: {
    name: "Gruñón",
    version: "De mal humor",
    text: [
      {
        title: "HAY PROBLEMAS A-BREWIN '",
        description: "Tus otros personajes de los Siete Enanitos obtienen +1 {S}.",
      },
    ],
  },
};
