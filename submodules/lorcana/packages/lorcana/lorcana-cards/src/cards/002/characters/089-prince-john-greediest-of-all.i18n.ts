import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const princeJohnGreediestOfAllI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Prince John",
    version: "Greediest of All",
    text: [
      {
        title: "Ward",
      },
      {
        title: "I SENTENCE YOU",
        description:
          "Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
      },
    ],
  },
  de: {
    name: "Prinz John",
    version: "Der Gierigste",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Ich verurteile dich",
        description:
          "Jedes Mal, wenn gegnerische Mitspielende Handkarten abwerfen, darfst du für jede abgeworfene Karte 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Prince Jean",
    version: "Le plus cupide de tous",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Je te condamne",
        description:
          "Chaque fois qu'un adversaire défausse au moins une carte, vous pouvez piocher autant de cartes.",
      },
    ],
  },
  it: {
    name: "Prince John",
    version: "Greediest of All",
    text: [
      {
        title: "<Ward> (Opponents can't choose this character except to challenge.)",
      },
      {
        title: "I Sentence You",
        description:
          "Whenever your opponent discards 1 or more cards, you may draw a card for each card discarded.",
      },
    ],
  },
  es: {
    name: "Príncipe juan",
    version: "El más codicioso de todos",
    text: [
      {
        title: "Pabellón",
      },
      {
        title: "TE CONDENO",
        description:
          "Siempre que tu oponente descarte 1 o más cartas, puedes robar una carta por cada carta descartada.",
      },
    ],
  },
};
