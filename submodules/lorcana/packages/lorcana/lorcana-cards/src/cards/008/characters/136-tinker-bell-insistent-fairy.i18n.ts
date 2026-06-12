import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinkerBellInsistentFairyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tinker Bell",
    version: "Insistent Fairy",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PAY ATTENTION",
        description:
          "Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Naseweis",
    version: "Hartnäckige Fee",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "GEBT ACHT",
        description:
          "Jedes Mal, wenn du einen Charakter mit 5 oder mehr ausspielst, darfst du jenen erschöpfen, um 2 Legenden zu sammeln.",
      },
    ],
  },
  fr: {
    name: "La Fée Clochette",
    version: "Fée insistante",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "SOYEZ ATTENTIFS",
        description:
          "Chaque fois que vous jouez un personnage ayant 5 ou plus, vous pouvez l'épuiser pour gagner 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Trilli",
    version: "Fata Insistente",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "DAMMI RETTA",
        description:
          "Ogni volta che giochi un personaggio con 5 o superiore, puoi impegnarlo per ottenere 2 leggenda.",
      },
    ],
  },
};
