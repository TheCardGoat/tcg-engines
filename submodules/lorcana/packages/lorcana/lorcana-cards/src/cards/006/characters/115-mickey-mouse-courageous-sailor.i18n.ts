import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseCourageousSailorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Courageous Sailor",
    text: [
      {
        title: "SOLID GROUND",
        description: "While this character is at a location, he gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Mutiger Seemann",
    text: [
      {
        title: "FESTER BODEN",
        description: "Solange dieser Charakter an einem Ort ist, erhält er +2.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Marin courageux",
    text: [
      {
        title: "TERRE FERME",
        description: "Tant que ce personnage est sur un lieu, il gagne +2.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Marinaio Coraggioso",
    text: [
      {
        title: "TERRAFERMA",
        description: "Mentre questo personaggio si trova in un luogo, riceve +2.",
      },
    ],
  },
};
