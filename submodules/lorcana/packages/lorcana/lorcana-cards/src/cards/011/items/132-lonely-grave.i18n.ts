import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lonelyGraveI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lonely Grave",
    text: [
      {
        title: "HAUNTING PRESENCE",
        description:
          "{E}, Banish chosen character of yours — Put the top card of your deck facedown under one of your characters or locations with Boost.",
      },
    ],
  },
  de: {
    name: "Einsames Grab",
    text: [
      {
        title: "UNHEIMLICHE",
        description:
          "PRÄSENZ, Verbanne einen deiner Charaktere — Lege die oberste Karte deines Decks verdeckt unter einen deiner Charaktere oder Orte mit Stärken.",
      },
    ],
  },
  fr: {
    name: "Tombe solitaire",
    text: [
      {
        title: "PRÉSENCE HANTANTE,",
        description:
          "Choisissez l'un de vos personnages et bannissez-le — Placez la carte du dessus de votre pioche, face cachée, sous l'un de vos personnages ou de vos lieux avec Boost.",
      },
    ],
  },
  it: {
    name: "Tomba Vuota",
    text: [
      {
        title: "PRESENZA INQUIETANTE,",
        description:
          "esilia un tuo personaggio a tua scelta — Metti la prima carta del tuo mazzo a faccia in giù sotto a uno dei tuoi personaggi o luoghi con Potenziamento.",
      },
    ],
  },
};
