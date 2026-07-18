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
        title: "Brachial",
        description: "Solange dieser Charakter beschädigt ist, erhält er +3 {S}.",
      },
    ],
  },
  fr: {
    name: "Scroop",
    version: "Traître",
    text: [
      {
        title: "Brute",
        description: "Tant que ce personnage a des jetons Dommage sur lui, il gagne +3 {S}.",
      },
    ],
  },
  it: {
    name: "Scroop",
    version: "Traditore",
    text: [
      {
        title: "Bruto",
        description: "Mentre questo personaggio ha danno, riceve +3 {S}.",
      },
    ],
  },
  es: {
    name: "Scroop",
    version: "Traidor",
    text: [
      {
        title: "BRUTO",
        description: "Mientras este personaje tenga daño, obtiene +3 {S}.",
      },
    ],
  },
};
