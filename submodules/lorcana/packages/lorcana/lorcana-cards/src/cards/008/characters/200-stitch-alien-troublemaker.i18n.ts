import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stitchAlienTroublemakerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stitch",
    version: "Alien Troublemaker",
    text: [
      {
        title: "I WIN!",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Stitch",
    version: "Alien-Unruhestifter",
    text: [
      {
        title: "ICH GEWINNE!",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du 1 Karte ziehen und 1 Legende sammeln.",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Fauteur de trouble extraterrestre",
    text: [
      {
        title: "J'AI GAGNÉ!",
        description:
          "Durant votre tour, chaque fois que ce personnage en bannit un autre via un défi, vous pouvez piocher une carte et gagner 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Alieno Piantagrane",
    text: [
      {
        title: "HO VINTO!",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, puoi pescare una carta e ottenere 1 leggenda.",
      },
    ],
  },
};
