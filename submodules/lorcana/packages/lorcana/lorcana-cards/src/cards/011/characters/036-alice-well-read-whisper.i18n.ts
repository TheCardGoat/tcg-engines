import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aliceWellreadWhisperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alice",
    version: "Well-Read Whisper",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "MYSTICAL INSIGHT",
        description: "Whenever this character quests, put all cards from under her into your hand.",
      },
    ],
  },
  de: {
    name: "Alice",
    version: "Belesenes Geflüster",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "MYSTISCHE EINSICHT",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, nimm alle Karten unter ihm auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Alice",
    version: "Lueur cultivée",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "INTUITION MYSTIQUE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, placez toutes les cartes sous lui dans votre main.",
      },
    ],
  },
  it: {
    name: "Alice",
    version: "Sussurro Istruito",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title: "CONOSCENZA MISTICA",
        description:
          "Ogni volta che questo personaggio va all'avventura, aggiungi tutte le carte sotto di esso alla tua mano.",
      },
    ],
  },
};
