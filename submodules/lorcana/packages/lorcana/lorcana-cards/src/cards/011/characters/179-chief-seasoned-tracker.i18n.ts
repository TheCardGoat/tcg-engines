import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const chiefSeasonedTrackerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Chief",
    version: "Seasoned Tracker",
    text: [
      {
        title: "GOOD RIDDANCE",
        description:
          "{E} — If an opposing character was banished in a challenge this turn, draw a card.",
      },
    ],
  },
  de: {
    name: "Chef, der Jagdhund",
    version: "Altgedienter Spurensucher",
    text: [
      {
        title: "Auf Wiedersehen",
        description:
          "{E} — Falls in diesem Zug ein gegnerischer Charakter durch eine Herausforderung verbannt wurde, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Chef",
    version: "Pisteur chevronné",
    text: [
      {
        title: "Bon débarras",
        description:
          "{E} — Si un personnage adverse a été banni via un défi ce tour-ci, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Fiuto",
    version: "Segugio Esperto",
    text: [
      {
        title: "Una Bella Liberazione",
        description:
          "{E} — Se un personaggio avversario è stato esiliato in una sfida in questo turno, pesca una carta.",
      },
    ],
  },
  es: {
    name: "Jefe",
    version: "Rastreador experimentado",
    text: [
      {
        title: "BUEN VIAJE",
        description:
          "{E}: si un personaje contrario fue desterrado en un desafío este turno, roba una carta.",
      },
    ],
  },
};
