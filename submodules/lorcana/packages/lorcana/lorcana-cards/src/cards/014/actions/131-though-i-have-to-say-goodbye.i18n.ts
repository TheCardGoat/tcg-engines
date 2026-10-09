import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thoughIHaveToSayGoodbyeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Though I Have to Say Goodbye",
    text: "Put the top 3 cards of your deck into your discard. Chosen character gets +1 {S} this turn for each song card in your discard.",
  },
  de: {
    name: "Muss ich jetzt auch leider gehen",
    text: "Lege die obersten 3 Karten deines Decks auf deinen Ablagestapel. Ein Charakter deiner Wahl erhält in diesem Zug +1 {S} für jede Liedkarte in deinem Ablagestapel.",
  },
  fr: {
    name: "Je vais devoir m’en aller",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Placez les 3 cartes du dessus de votre pioche dans votre défausse. Choisissez un personnage qui gagne +1 {S} pour chaque carte Chanson dans votre défausse pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Non Dimenticarlo Mai",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Metti le prime 3 carte del tuo mazzo nei tuoi scarti. Un personaggio a tua scelta riceve +1 {S} per questo turno per ogni carta canzone nei tuoi scarti.",
      },
    ],
  },
  es: {
    name: "Though I Have to Say Goodbye",
    text: "Put the top 3 cards of your deck into your discard. Chosen character gets +1 {S} this turn for each song card in your discard.",
  },
};
