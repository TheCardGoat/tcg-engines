import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const friendLikeMeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Friend Like Me",
    text: "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
  },
  de: {
    name: "Einen Freund wie mich",
    text: [
      {
        title: "Alle Mitspielenden",
        description:
          "(auch du) legen die obersten 3 Karten ihres Decks verdeckt und erschöpft in ihren Tintenvorrat.",
      },
    ],
  },
  fr: {
    name: "Je suis ton meilleur ami",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 5 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Chaque joueur place les 3 premières cartes de sa pioche dans sa réserve d'encre, faces cachées et épuisées.",
      },
    ],
  },
  it: {
    name: "Un Amico Come Me",
    text: [
      {
        title:
          "(Un personaggio con costo 5 o superiore può {E} per giocare questa canzone gratis.)",
      },
      {
        title:
          "Ogni giocatore aggiunge le prime 3 carte del proprio mazzo al suo calamaio, a faccia in giù e impegnate.",
      },
    ],
  },
  es: {
    name: "Amigo como yo",
    text: "Cada jugador coloca las 3 primeras cartas de su mazo en su tintero boca abajo y las ejerce.",
  },
};
