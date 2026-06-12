import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scroopBackstabberI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scroop",
    version: "Backstabber",
    text: [
      {
        title: "BRUTE",
        description: "While this character has damage, he gets +3 {S}.",
      },
    ],
  },
  de: {
    name: "Scroop",
    version: "Hinterlistig",
    text: [
      {
        title: "BRACHIAL",
        description: "Solange dieser Charakter beschädigt ist, erhält er +3.",
      },
    ],
  },
  fr: {
    name: "Scroop",
    version: "Traître",
    text: [
      {
        title: "BRUTE",
        description: "Tant que ce personnage a des jetons Dommage sur lui, il gagne +3.",
      },
    ],
  },
  it: {
    name: "Scroop",
    version: "Traditore",
    text: [
      {
        title: "BRUTO",
        description: "Mentre questo personaggio ha danno, riceve +3.",
      },
    ],
  },
};
