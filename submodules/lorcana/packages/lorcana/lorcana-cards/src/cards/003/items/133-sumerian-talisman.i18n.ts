import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sumerianTalismanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sumerian Talisman",
    text: [
      {
        title: "SOURCE OF MAGIC",
        description:
          "During your turn, whenever one of your characters is banished in a challenge, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Sumerischer Talisman",
    text: [
      {
        title: "Die Quelle der Magie",
        description:
          "Jedes Mal, wenn einer deiner Charaktere in deinem Zug durch eine Herausforderung verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Talisman sumérien",
    text: [
      {
        title: "Source de magie",
        description:
          "Chaque fois que l'un de vos personnages est banni via un défi durant votre tour, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Talismano Sumero",
    text: [
      {
        title: "Fonte di Magia",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi personaggi viene esiliato in una sfida, puoi pescare una carta.",
      },
    ],
  },
  es: {
    name: "Talismán sumerio",
    text: [
      {
        title: "FUENTE DE MAGIA",
        description:
          "Durante tu turno, cada vez que uno de tus personajes sea desterrado en un desafío, podrás robar una carta.",
      },
    ],
  },
};
