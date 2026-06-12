import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pigletSturdySwordsmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Piglet",
    version: "Sturdy Swordsman",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "NOT SO SMALL ANYMORE",
        description:
          "While you have no cards in your hand, this character can challenge ready characters.",
      },
    ],
  },
  de: {
    name: "Ferkel",
    version: "Tapferer Schwertkämpfer",
    text: [
      {
        title: "Robust +1",
      },
      {
        title: "NICHT MEHR GANZ SO KLEIN",
        description:
          "Solange du keine Karten auf der Hand hast, kann dieser Charakter bereite Charaktere herausfordern.",
      },
    ],
  },
  fr: {
    name: "Porcinet",
    version: "Épéiste costaud",
    text: [
      {
        title: "Résistance +1",
      },
      {
        title: "PLUS SI PETIT",
        description:
          "Tant que vous n'avez aucune carte en main, ce personnage peut défier des personnages redressés.",
      },
    ],
  },
  it: {
    name: "Pimpi",
    version: "Spadaccino Robusto",
    text: [
      {
        title: "Resistere +1",
      },
      {
        title: "NON PIÙ COSÌ PICCOLO",
        description:
          "Mentre non hai carte in mano, questo personaggio può sfidare i personaggi preparati.",
      },
    ],
  },
};
