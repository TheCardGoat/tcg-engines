import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trampDapperRascalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tramp",
    version: "Dapper Rascal",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "PLAY IT COOL",
        description:
          "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Strolch",
    version: "Eleganter Rabauke",
    text: [
      {
        title: "Gestaltwandel 4",
      },
      {
        title: "BLEIB COOL",
        description:
          "Jedes Mal, wenn einer deiner Charaktere im Zug einer gegnerischen Person verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Clochard",
    version: "Voyou élégant",
    text: [
      {
        title: "Alter 4",
      },
      {
        title: "GARDER SON SANG-FROID",
        description:
          "Durant le tour d'un adversaire, chaque fois que l'un de vos personnages est banni, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Biagio",
    version: "Elegante Mascalzone",
    text: [
      {
        title: "Trasformazione 4",
      },
      {
        title: "RESTARE CALMO",
        description:
          "Durante il turno di un avversario, ogni volta che uno dei tuoi personaggi viene esiliato, puoi pescare una carta.",
      },
    ],
  },
};
