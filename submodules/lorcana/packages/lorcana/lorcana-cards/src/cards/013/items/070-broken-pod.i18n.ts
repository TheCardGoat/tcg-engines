import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const brokenPodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Broken Pod",
    text: [
      {
        title: "RENEWAL PROCESS",
        description:
          "{E}, 1 {I} — Put a card from chosen player's discard on the bottom of their deck.",
      },
    ],
  },
  de: {
    name: "Beschädigte Schote",
    text: [
      {
        title: "Erneuerungsprozess",
        description:
          "{E}, 1 {I} — Lege 1 Karte aus einem Ablagestapel deiner Wahl unter das zugehörige Deck.",
      },
    ],
  },
  fr: {
    name: "Bulbe brisé",
    text: [
      {
        title: "Renouvellement",
        description:
          "{E}, 1 {I} — Choisissez un joueur et placez une carte de sa défausse sous sa pioche.",
      },
    ],
  },
  it: {
    name: "Baccello Rotto",
    text: [
      {
        title: "Processo di Rinnovamento",
        description:
          "{E}, 1 {I} — Metti una carta dagli scarti di un giocatore a tua scelta in fondo al suo mazzo.",
      },
    ],
  },
  es: {
    name: "Vaina rota",
    text: [
      {
        title: "PROCESO DE RENOVACIÓN",
        description:
          "{E}, 1 {I}: coloca una carta del descarte del jugador elegido en la parte inferior de su mazo.",
      },
    ],
  },
};
