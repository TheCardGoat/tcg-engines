import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const jiminyCricketGhostOfChristmasPastEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Jiminy Cricket",
    version: "Ghost of Christmas Past",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "LOOK INTO YOUR PAST",
        description:
          "Whenever you put a card under this character, you may put a card from your discard into your inkwell facedown and exerted.",
      },
    ],
  },
  de: {
    name: "Jiminy Grille",
    version: "Geist der vergangenen Weihnacht",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Blick in deine Vergangenheit",
        description:
          "Jedes Mal, wenn du eine Karte unter diesen Charakter legst, darfst du 1 Karte aus deinem Ablagestapel verdeckt und erschöpft in deinen Tintenvorrat legen.",
      },
    ],
  },
  fr: {
    name: "Jiminy Cricket",
    version: "Fantôme des Noëls passés",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Contemple ton passé",
        description:
          "Chaque fois que vous placez une carte sous ce personnage, vous pouvez placer une carte de votre défausse dans votre réserve d'encre, face cachée et épuisée.",
      },
    ],
  },
  it: {
    name: "Grillo Parlante",
    version: "Fantasma dei Natali Passati",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Guarda nel Tuo Passato",
        description:
          "Ogni volta che metti una carta sotto a questo personaggio, puoi aggiungere una carta dai tuoi scarti al tuo calamaio, a faccia in giù e impegnata.",
      },
    ],
  },
};
