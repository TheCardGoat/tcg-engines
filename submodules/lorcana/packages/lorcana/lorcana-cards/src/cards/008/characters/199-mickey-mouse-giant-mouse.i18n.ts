import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mickeyMouseGiantMouseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mickey Mouse",
    version: "Giant Mouse",
    text: [
      {
        title: "Bodyguard",
      },
      {
        title: "THE BIGGEST STAR EVER",
        description: "When this character is banished, deal 5 damage to each opposing character.",
      },
    ],
  },
  de: {
    name: "Micky Maus",
    version: "Riesige Maus",
    text: [
      {
        title: "Beschützen",
      },
      {
        title: "DER GRÖSSTE STAR VON ALLEN",
        description:
          "Wenn dieser Charakter verbannt wird, füge jedem gegnerischen Charakter 5 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Mickey Mouse",
    version: "Souris géante",
    text: [
      {
        title: "Rempart",
      },
      {
        title: "LA PLUS GRANDE STAR DE TOUS LES TEMPS",
        description:
          "Lorsque ce personnage est banni, infligez 5 dommages à chaque personnage adverse.",
      },
    ],
  },
  it: {
    name: "Topolino",
    version: "Topo Gigante",
    text: [
      {
        title: "Guardiano",
      },
      {
        title: "LA PIÙ GRANDE STAR DI SEMPRE",
        description:
          "Quando questo personaggio viene esiliato, infliggi 5 danni a ogni personaggio avversario.",
      },
    ],
  },
};
