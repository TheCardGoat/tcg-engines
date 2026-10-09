import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magnificentMarvelousI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magnificent, Marvelous",
    text: "Gain 2 lore. Draw a card.",
  },
  de: {
    name: "Die Makabere, Manische",
    text: "Sammle 2 Legenden. Ziehe 1 Karte.",
  },
  fr: {
    name: "Magnifique, merveilleuse",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Gagnez 2 éclats de lore. Piochez une carte.",
      },
    ],
  },
  it: {
    name: "La Magnifica, Splendida",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Ottieni 2 leggenda. Pesca una carta.",
      },
    ],
  },
  es: {
    name: "Magnificent, Marvelous",
    text: "Gain 2 lore. Draw a card.",
  },
};
