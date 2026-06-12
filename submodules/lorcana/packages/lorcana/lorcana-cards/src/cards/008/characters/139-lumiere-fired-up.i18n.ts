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
        title: "Gestaltwandel 3",
      },
      {
        title: "Wendig",
      },
      {
        title: "SACRE BLEU!",
        description:
          "Jedes Mal, wenn einer deiner Gegenstände verbannt wird, erhält dieser Charakter in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Lumière",
    version: "Tout feu tout flamme",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "Insaisissable",
      },
      {
        title: "SACREBLEU!",
        description:
          "Chaque fois que l'un de vos objets est banni, ce personnage gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lumiere",
    version: "Fiammeggiante",
    text: [
      {
        title: "Trasformazione 3",
      },
      {
        title: "Sfuggente",
      },
      {
        title: "SACREBLEU!",
        description:
          "Ogni volta che uno dei tuoi oggetti viene esiliato, questo personaggio riceve +1 per questo turno.",
      },
    ],
  },
};
