import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseFunkySpelunkerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Funky Spelunker",
    text: [
      {
        title: "JOURNEY",
        description: "While this character is at a location, she gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Minnie Maus",
    version: "Flippige Höhlenforscherin",
    text: [
      {
        title: "Reise",
        description: "Solange dieser Charakter an einem Ort ist, erhält er +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Spéléologue funky",
    text: [
      {
        title: "Voyage",
        description: "Tant que ce personnage se trouve sur un lieu, il gagne +2 {S}.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Speleologa Eccentrica",
    text: [
      {
        title: "Viaggio",
        description: "Mentre questo personaggio si trova in un luogo, riceve +2 {S}.",
      },
    ],
  },
};
