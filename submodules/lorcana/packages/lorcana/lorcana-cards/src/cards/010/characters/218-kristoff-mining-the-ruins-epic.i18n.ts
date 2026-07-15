import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kristoffMiningTheRuinsEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kristoff",
    version: "Mining the Ruins",
    text: [
      {
        title: "Boost 1 {I}",
      },
      {
        title: "WORTH MINING",
        description:
          "Whenever this character quests, if there's a card under him, put the top card of your deck into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Kristoff",
    version: "Baut die Ruinen ab",
    text: [
      {
        title:
          "<Stärken> 1 {I} (Einmal während deines Zuges darfst du 1 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Ein Guter Fund",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, falls er mindestens eine Karte unter sich hat, lege die oberste Karte deines Decks verdeckt und erschöpft in deinen Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Kristoff",
    version: "Minant les ruines",
    text: [
      {
        title:
          "<Boost> 1 {I} (Une fois durant votre tour, vous pouvez payer 1 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Un trésor qu'il faut mériter",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, s'il y a une carte sous lui, placez la carte du dessus de votre pioche dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Kristoff",
    version: "Minatore nelle Rovine",
    text: [
      {
        title:
          "<Potenziamento> 1 {I} (Una volta durante il tuo turno, puoi pagare 1 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Cuore Freddo",
        description:
          "Ogni volta che questo personaggio va all'avventura, se c'è una carta sotto di esso, aggiungi la prima carta del tuo mazzo al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
};
