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
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Mystische Einsicht",
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
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Intuition mystique",
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
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Conoscenza Mistica",
        description:
          "Ogni volta che questo personaggio va all'avventura, aggiungi tutte le carte sotto di esso alla tua mano.",
      },
    ],
  },
  es: {
    name: "Alicia",
    version: "Susurro bien leído",
    text: [
      {
        title: "Impulsar 2 {I}",
      },
      {
        title: "VISIÓN MÍSTICA",
        description:
          "Siempre que este personaje realice una misión, pon todas las cartas que tiene debajo en tu mano.",
      },
    ],
  },
};
