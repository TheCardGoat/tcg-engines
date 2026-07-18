import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kronkJuniorChipmunkI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kronk",
    version: "Junior Chipmunk",
    text: [
      {
        title: "Resist +1",
      },
      {
        title: "SCOUT LEADER",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Kronk",
    version: "Junior Chipmunk",
    text: [
      {
        title:
          "<Robust> +1 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 1.)",
      },
      {
        title: "Pfadfinder",
        description:
          "Jedes Mal, wenn dieser Charakter in deinem Zug durch eine Herausforderung einen anderen Charakter verbannt, darfst du einem Charakter deiner Wahl 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Kronk",
    version: "Ragondin junior",
    text: [
      {
        title: "<Résistance> +1",
      },
      {
        title: "Chef scout",
        description:
          "Lorsque ce personnage en bannit un autre via un défi durant votre tour, vous pouvez choisir un personnage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "Kronk",
    version: "Junior Chipmunk",
    text: [
      {
        title: "<Resist> +1 (Damage dealt to this character is reduced by 1.)",
      },
      {
        title: "Scout Leader",
        description:
          "During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen character.",
      },
    ],
  },
  es: {
    name: "Kronk",
    version: "Ardilla joven",
    text: [
      {
        title: "Resistir +1",
      },
      {
        title: "LÍDER SCOUT",
        description:
          "Durante tu turno, cada vez que este personaje destierre a otro personaje en un desafío, puedes causar 2 daños al personaje elegido.",
      },
    ],
  },
};
