import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rayaUnstoppableForceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Raya",
    version: "Unstoppable Force",
    text: [
      {
        title: "Challenger +2",
      },
      {
        title: "Resist +2",
      },
      {
        title: "YOU GAVE IT YOUR BEST",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Raya",
    version: "Unaufhaltsame Kraft",
    text: [
      {
        title: "Herausfordern +2",
      },
      {
        title: "Robust +2",
      },
      {
        title: "DU HAST DEIN BESTES GETAN",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Raya",
    version: "Force inarrêtable",
    text: [
      {
        title: "Offensif +2",
      },
      {
        title: "Résistance +2",
      },
      {
        title: "L'IMPORTANT, C'EST D'ESSAYER",
        description:
          "Chaque fois que ce personnage en bannit un autre via un défi durant votre tour, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Raya",
    version: "Forza Inarrestabile",
    text: [
      {
        title: "Sfidante +2",
      },
      {
        title: "Resistere +2",
      },
      {
        title: "HAI FATTO DEL TUO MEGLIO",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, puoi pescare una carta.",
      },
    ],
  },
};
