import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kodaTalkativeCubI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Koda",
    version: "Talkative Cub",
    text: [
      {
        title: "TELL EVERYBODY",
        description: "During opponents' turns, you can't lose lore.",
      },
    ],
  },
  de: {
    name: "Koda",
    version: "Redseliges Jungtier",
    text: [
      {
        title: "SAG'S ALLEN",
        description: "Du kannst im Zug einer gegnerischen Person keine Legenden verlieren.",
      },
    ],
  },
  fr: {
    name: "Koda",
    version: "Ourson bavard",
    text: [
      {
        title: "DITES À MES AMIS",
        description:
          "Durant le tour de vos adversaires, vous ne pouvez pas perdre d'éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Koda",
    version: "Cucciolo Chiacchierone",
    text: [
      {
        title: "IL MIO CAMMINO MI PORTA VIA",
        description: "Durante il turno degli avversari, non puoi perdere leggenda.",
      },
    ],
  },
};
