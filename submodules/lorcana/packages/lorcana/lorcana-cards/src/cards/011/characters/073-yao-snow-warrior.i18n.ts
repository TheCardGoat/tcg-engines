import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const yaoSnowWarriorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Yao",
    version: "Snow Warrior",
    text: [
      {
        title: "OOH, I'M SCARED",
        description: "During opponents' turns, this character gains Resist +2.",
      },
    ],
  },
  de: {
    name: "Yao",
    version: "Schneekrieger",
    text: [
      {
        title: "Ooh, ich habe Angst",
        description:
          "Dieser Charakter erhält im Zug einer gegnerischen Person <Robust> +2. (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Yao",
    version: "Guerrier des neiges",
    text: [
      {
        title: "Ooh, j'ai peur",
        description: "Durant le tour de vos adversaires, ce personnage gagne <Résistance> +2.",
      },
    ],
  },
  it: {
    name: "Yao",
    version: "Guerriero delle Nevi",
    text: [
      {
        title: "Ooh, che Paura",
        description: "Durante i turni degli avversari, questo personaggio ottiene <Resistere> +2.",
      },
    ],
  },
  es: {
    name: "Yao",
    version: "Guerrero de la nieve",
    text: [
      {
        title: "Ooh, tengo miedo",
        description: "Durante los turnos de los oponentes, este personaje gana Resistencia +2.",
      },
    ],
  },
};
