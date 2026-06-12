import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const puaProtectivePigI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pua",
    version: "Protective Pig",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "FREE FRUIT",
        description: "When this character is banished, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Pua",
    version: "Beschützendes Schwein",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "GRATIS OBST",
        description: "Wenn dieser Charakter verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Pua",
    version: "Cochon protecteur",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "FRUITS GRATUITS",
        description: "Lorsque ce personnage est banni, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Pua",
    version: "Maiale Protettivo",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "FRUTTA GRATIS",
        description: "Quando questo personaggio viene esiliato, puoi pescare una carta.",
      },
    ],
  },
};
