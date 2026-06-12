import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const buckyNuttyRascalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bucky",
    version: "Nutty Rascal",
    text: [
      {
        title: "POP!",
        description: "When this character is banished in a challenge, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Bucky",
    version: "Nussiger Schlingel",
    text: [
      {
        title: "POP!",
        description:
          "Wenn dieser Charakter durch eine Herausforderung verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Bucky",
    version: "Chenapan à la noix",
    text: [
      {
        title: "BANG!",
        description: "Lorsque ce personnage est banni via un défi, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Bucky",
    version: "Bricconcello Svitato",
    text: [
      {
        title: "POP!",
        description:
          "Quando questo personaggio viene esiliato in una sfida, puoi pescare una carta.",
      },
    ],
  },
};
