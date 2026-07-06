import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const alphaPackLeaderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alpha",
    version: "Pack Leader",
    text: [
      {
        title: "Who Wants a Treat?",
        description:
          "Whenever you play an item, chosen character gets +1 {S} and gains <Resist> +1 this turn.",
      },
    ],
  },
  de: {
    name: "Alpha",
    version: "Rudelführer",
    text: [
      {
        title: "Wer will ein Leckerli?",
        description:
          "Jedes Mal, wenn du einen Gegenstand ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +1 {S} und <Robust> +1. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 1.)",
      },
    ],
  },
  fr: {
    name: "Alpha",
    version: "Chef de meute",
    text: [
      {
        title: "Qui veut une friandise?",
        description:
          "Chaque fois que vous jouez un objet, choisissez un personnage qui gagne +1 {S} et <Résistance> +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Alpha",
    version: "Capobranco",
    text: [
      {
        title: "Chi Vuole un Premio?",
        description:
          "Ogni volta che giochi un oggetto, un personaggio a tua scelta riceve +1 {S} e ottiene <Resistere> +1 per questo turno.",
      },
    ],
  },
};
