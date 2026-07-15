import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lumiereFiredUpI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lumiere",
    version: "Fired Up",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "Evasive, Ward",
      },
      {
        title: "SACREBLEU!:",
        description:
          "Whenever one of your items is banished, this character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Lumière",
    version: "Angefeuert",
    text: [
      {
        title:
          "<Gestaltwandel> 3 (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Lumière-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Sacre bleu!",
        description:
          "Jedes Mal, wenn einer deiner Gegenstände verbannt wird, erhält dieser Charakter in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Lumière",
    version: "Tout feu tout flamme",
    text: [
      {
        title:
          "<Alter> 3 (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages Lumière.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Sacrebleu!",
        description:
          "Chaque fois que l'un de vos objets est banni, ce personnage gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lumiere",
    version: "Fiammeggiante",
    text: [
      {
        title:
          "<Trasformazione> 3 (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Lumiere.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Sacrebleu!",
        description:
          "Ogni volta che uno dei tuoi oggetti viene esiliato, questo personaggio riceve +1 {L} per questo turno.",
      },
    ],
  },
};
