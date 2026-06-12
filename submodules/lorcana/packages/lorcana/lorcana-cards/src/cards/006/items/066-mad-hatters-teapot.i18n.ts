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
        title: "HIER IST KEIN PLATZ MEHR, 1",
        description:
          "— Alle gegnerischen Mitspielenden legen die oberste Karte ihres Decks auf ihren Ablagestapel.",
      },
    ],
  },
  fr: {
    name: "Théière du Chapelier Fou",
    text: [
      {
        title: "PAS D'PLACE, PAS D'PLACE, 1",
        description: "— Chaque adversaire place la carte du dessus de sa pioche dans sa défausse.",
      },
    ],
  },
  it: {
    name: "Teiera del Cappellaio Matto",
    text: [
      {
        title: "NON",
        description:
          "C'È POSTO, NON C'È POSTO, 1 — Ogni avversario mette la prima carta del suo mazzo nei suoi scarti.",
      },
    ],
  },
};
