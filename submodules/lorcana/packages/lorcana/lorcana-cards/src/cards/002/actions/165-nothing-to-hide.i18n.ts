import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nothingToHideI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nothing to Hide",
    text: "Each opponent reveals their hand. Draw a card.",
  },
  de: {
    name: "Nichts zu verstecken",
    text: [
      {
        title: "Alle gegnerischen Mitspielenden zeigen ihre Handkarten für alle sichtbar vor.",
      },
      {
        title: "Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Rien à cacher",
    text: "Chaque adversaire révèle sa main. Piochez une carte.",
  },
  it: {
    name: "Nothing to Hide",
    text: "Each opponent reveals their hand. Draw a card.",
  },
  es: {
    name: "Nada que ocultar",
    text: "Cada oponente revela su mano. Saca una carta.",
  },
};
