import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinRabbitI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Rabbit",
    text: [
      {
        title: "HOPPITY HIP!",
        description: "When you play this character and when he leaves play, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Hase",
    text: [
      {
        title: "Hoppedi Hippedi!",
        description:
          "Wenn du diesen Charakter ausspielst und wenn er das Spiel verlässt, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "En lapin",
    text: [
      {
        title: "Hoppity Hip!",
        description:
          "Lorsque vous jouez ce personnage et lorsqu'il quitte la zone de jeu, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Merlino",
    version: "Coniglio",
    text: [
      {
        title: "Hoppiti Hip!",
        description:
          "Quando giochi questo personaggio e quando lascia il gioco, puoi pescare una carta.",
      },
    ],
  },
};
