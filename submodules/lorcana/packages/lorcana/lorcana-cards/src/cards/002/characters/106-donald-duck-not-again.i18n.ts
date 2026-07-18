import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckNotAgainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Not Again!",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PHOOEY!",
        description: "This character gets +1 {L} for each 1 damage on him.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Nicht schon wieder!",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Es reicht!",
        description: "Dieser Charakter erhält für jeden Schaden auf ihm +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Pas encore !",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "J'en ai assez!",
        description: "Ce personnage gagne +1 {L} pour chaque jeton Dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Donald Duck",
    version: "Not Again!",
    text: [
      {
        title: "<Evasive> (Only characters with Evasive can challenge this character.)",
      },
      {
        title: "Phooey!",
        description: "This character gets +1 {L} for each 1 damage on him.",
      },
    ],
  },
  es: {
    name: "Pato donald",
    version: "¡Otra vez no!",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "¡POOEY!",
        description: "Este personaje obtiene +1 {L} por cada 1 daño que sufre.",
      },
    ],
  },
};
