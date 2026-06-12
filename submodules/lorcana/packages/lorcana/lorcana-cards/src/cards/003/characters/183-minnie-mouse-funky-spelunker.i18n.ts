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
        title: "REISE",
        description: "Solange dieser Charakter an einem Ort ist, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Minnie",
    version: "Spéléologue funky",
    text: [
      {
        title: "VOYAGE",
        description: "Tant que ce personnage se trouve sur un lieu, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Minni",
    version: "Speleologa Eccentrica",
    text: [
      {
        title: "VIAGGIO",
        description: "Mentre questo personaggio si trova in un luogo, riceve +2.",
      },
    ],
  },
};
