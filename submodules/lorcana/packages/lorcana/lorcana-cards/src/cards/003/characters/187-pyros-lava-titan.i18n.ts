import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pyrosLavaTitanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pyros",
    version: "Lava Titan",
    text: [
      {
        title: "ERUPTION",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may ready chosen character.",
      },
    ],
  },
  de: {
    name: "Vulkanos",
    version: "Lava Titan",
    text: [
      {
        title: "ERUPTION",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du einen Charakter deiner Wahl bereit machen.",
      },
    ],
  },
  fr: {
    name: "Pyros",
    version: "Titan de lave",
    text: [
      {
        title: "ÉRUPTION",
        description:
          "Chaque fois que ce personnage en bannit un autre via un défi durant votre tour, vous pouvez choisir et redresser un personnage.",
      },
    ],
  },
  it: {
    name: "Pyros",
    version: "Titano di Lava",
    text: [
      {
        title: "ERUZIONE",
        description:
          "Durante il tuo turno, ogni volta che questo personaggio esilia un altro personaggio in una sfida, puoi preparare un personaggio a tua scelta.",
      },
    ],
  },
};
