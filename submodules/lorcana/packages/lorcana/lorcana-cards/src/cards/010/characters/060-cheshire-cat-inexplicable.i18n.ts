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
        title: "Stärken 2",
      },
      {
        title: "DAS WÄRE EIN SPASS",
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
        title: "Boost 2",
      },
      {
        title: "ÇA POURRAIT ÊTRE TRÈS AMUSANT",
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
        title: "Potenziamento 2",
      },
      {
        title: "CI SAREBBE DA RIDERE",
        description:
          "Ogni volta che metti una carta sotto a questo personaggio, puoi spostare fino a 2 segnalini danno da un personaggio a tua scelta a un personaggio avversario a tua scelta.",
      },
    ],
  },
};
