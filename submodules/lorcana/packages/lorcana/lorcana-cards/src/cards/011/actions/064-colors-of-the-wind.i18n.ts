import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const colorsOfTheWindI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Colors of the Wind",
    text: "Each player reveals the top card of their deck. Draw a card for each different ink type of cards revealed this way.",
  },
  de: {
    name: "Das Farbenspiel des Winds",
    text: [
      {
        title: "Alle Mitspielenden",
        description:
          "(auch du) decken die oberste Karte ihres Decks auf. Ziehe 1 Karte für jedes unterschiedliche Tintenfarbensymbol unter den auf diese Weise aufgedeckten Karten.",
      },
    ],
  },
  fr: {
    name: "L’air du vent",
    text: "Chaque joueur révèle la carte du dessus de sa pioche. Piochez une carte pour chaque couleur d'encre différente figurant sur les cartes ainsi révélées.",
  },
  it: {
    name: "Il Vento e i Suoi Color",
    text: "Ogni giocatore rivela la prima carta del suo mazzo. Pesca una carta per ogni tipo di inchiostro diverso delle carte rivelate in questo modo.",
  },
};
