import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cheshireCatInexplicableI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cheshire Cat",
    version: "Inexplicable",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "IT'S LOADS OF FUN",
        description:
          "Whenever you put a card under this character, you may move up to 2 damage counters from chosen character to chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Grinsekatze",
    version: "Unerklärlich",
    text: [
      {
        title:
          "<Stärken> 2 {I} (Einmal während deines Zuges darfst du 2 {I} bezahlen, um die oberste Karte deines Decks verdeckt unter diesen Charakter zu legen.)",
      },
      {
        title: "Das wäre ein Spaß",
        description:
          "Jedes Mal, wenn du eine Karte unter diesen Charakter legst, darfst du bis zu 2 Schadensmarker von einem Charakter deiner Wahl zu einem gegnerischen Charakter deiner Wahl verschieben.",
      },
    ],
  },
  fr: {
    name: "Chat du Cheshire",
    version: "Inexplicable",
    text: [
      {
        title:
          "<Boost> 2 {I} (Une fois durant votre tour, vous pouvez payer 2 {I} pour placer la carte du dessus de votre pioche sous cette carte, face cachée.)",
      },
      {
        title: "Ça pourrait être très amusant",
        description:
          "Chaque fois que vous placez une carte sous ce personnage, vous pouvez choisir un personnage et déplacer jusqu'à 2 de ses dommages sur un personnage adverse de votre choix.",
      },
    ],
  },
  it: {
    name: "Stregatto",
    version: "Inspiegabile",
    text: [
      {
        title:
          "<Potenziamento> 2 {I} (Una volta durante il tuo turno, puoi pagare 2 {I} per mettere la prima carta del tuo mazzo a faccia in giù sotto a questo personaggio.)",
      },
      {
        title: "Ci Sarebbe da Ridere",
        description:
          "Ogni volta che metti una carta sotto a questo personaggio, puoi spostare fino a 2 segnalini danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
  es: {
    name: "Gato de cheshire",
    version: "Inexplicable",
    text: [
      {
        title: "Impulsar 2 {I}",
      },
      {
        title: "ES MUY DIVERTIDO",
        description:
          "Siempre que coloques una carta debajo de este personaje, puedes mover hasta 2 contadores de daño del personaje elegido al personaje contrario elegido.",
      },
    ],
  },
};
