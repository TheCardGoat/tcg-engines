import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const earthGiantLivingMountainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Earth Giant",
    version: "Living Mountain",
    text: [
      {
        title: "UNEARTHED",
        description: "When you play this character, each opponent draws a card.",
      },
    ],
  },
  de: {
    name: "Erdriese",
    version: "Lebendiger Berg",
    text: [
      {
        title: "Ausgegraben",
        description:
          "Wenn du diesen Charakter ausspielst, ziehen alle gegnerischen Mitspielenden je 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Géant de la Terre",
    version: "Montagne vivante",
    text: [
      {
        title: "Déterré",
        description: "Lorsque vous jouez ce personnage, chaque adversaire pioche une carte.",
      },
    ],
  },
  it: {
    name: "Gigante di Terra",
    version: "Montagna Vivente",
    text: [
      {
        title: "Dissotterrato",
        description: "Quando giochi questo personaggio, ogni avversario pesca una carta.",
      },
    ],
  },
  es: {
    name: "Gigante de la Tierra",
    version: "Montaña viva",
    text: [
      {
        title: "DESENTERRADO",
        description: "Cuando juegas con este personaje, cada oponente roba una carta.",
      },
    ],
  },
};
