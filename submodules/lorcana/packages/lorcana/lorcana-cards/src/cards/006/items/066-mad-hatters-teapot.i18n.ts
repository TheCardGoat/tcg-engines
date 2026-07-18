import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madHattersTeapotI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mad Hatter's Teapot",
    text: [
      {
        title: "NO ROOM, NO ROOM",
        description:
          "{E}, 1 {I} — Each opponent puts the top card of their deck into their discard.",
      },
    ],
  },
  de: {
    name: "Teekanne des verrückten Hutmachers",
    text: [
      {
        title: "Hier ist kein Platz mehr",
        description:
          "{E}, 1 {I} — Alle gegnerischen Mitspielenden legen die oberste Karte ihres Decks auf ihren Ablagestapel.",
      },
    ],
  },
  fr: {
    name: "Théière du Chapelier Fou",
    text: [
      {
        title: "Pas d'place, Pas d'place",
        description:
          "{E}, 1 {I} — Chaque adversaire place la carte du dessus de sa pioche dans sa défausse.",
      },
    ],
  },
  it: {
    name: "Teiera del Cappellaio Matto",
    text: [
      {
        title: "Non C'È Posto, Non C'È Posto",
        description:
          "{E}, 1 {I} — Ogni avversario mette la prima carta del suo mazzo nei suoi scarti.",
      },
    ],
  },
  es: {
    name: "Tetera del Sombrerero Loco",
    text: [
      {
        title: "SIN HABITACIÓN, SIN HABITACIÓN",
        description: "{E}, 1 {I}: cada oponente pone la carta superior de su mazo en su descarte.",
      },
    ],
  },
};
