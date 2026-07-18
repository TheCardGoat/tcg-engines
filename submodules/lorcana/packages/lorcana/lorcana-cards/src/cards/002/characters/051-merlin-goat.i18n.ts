import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merlinGoatI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merlin",
    version: "Goat",
    text: [
      {
        title: "HERE",
        description: "I COME! When you play this character and when he leaves play, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Merlin",
    version: "Ziege",
    text: [
      {
        title: "Jetzt komme ich!",
        description:
          "Wenn du diesen Charakter ausspielst und wenn er das Spiel verlässt, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Merlin",
    version: "En chèvre",
    text: [
      {
        title: "Attention, j'arrive!",
        description:
          "Lorsque vous jouez ce personnage et lorsqu'il quitte la zone de jeu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Merlin",
    version: "Goat",
    text: [
      {
        title: "Here I Come!",
        description: "When you play this character and when he leaves play, gain 1 lore.",
      },
    ],
  },
  es: {
    name: "Esmerejón",
    version: "Cabra",
    text: [
      {
        title: "AQUÍ",
        description:
          "¡YO VENGO! Cuando juegas con este personaje y cuando deja el juego, ganas 1 conocimiento.",
      },
    ],
  },
};
