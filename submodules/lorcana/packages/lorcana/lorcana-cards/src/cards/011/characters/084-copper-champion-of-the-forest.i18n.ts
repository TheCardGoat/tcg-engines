import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const copperChampionOfTheForestI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Copper",
    version: "Champion of the Forest",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "MORE TO EXPLORE",
        description:
          "Whenever this character quests, your characters with Evasive get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Capper",
    version: "Held des Waldes",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Capper-Charaktere auszuspielen.)",
      },
      {
        title: "Mehr zu erforschen",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine Charaktere mit <Wendig> in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Rouky",
    version: "Champion de la forêt",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Rouky.)",
      },
      {
        title: "Davantage à explorer",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos personnages avec <Insaisissable> gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Toby",
    version: "Campione del Bosco",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Toby.)",
      },
      {
        title: "Più Cose da Esplorare",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi personaggi con <Sfuggente> ricevono +1 {L} per questo turno.",
      },
    ],
  },
};
