import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const duckworthGhostButlerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Duckworth",
    version: "Ghost Butler",
    text: [
      {
        title: "Rush",
      },
      {
        title: "FINAL ACT",
        description:
          "During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
      },
    ],
  },
  de: {
    name: "Johann",
    version: "Geisterbutler",
    text: [
      {
        title: "Rasant",
      },
      {
        title: "LETZTER AKT",
        description:
          "Wenn dieser Charakter in deinem Zug verbannt wird, darfst du die oberste Karte deines Decks verdeckt unter einen deiner Charaktere oder Orte mit Stärken legen.",
      },
    ],
  },
  fr: {
    name: "Arsène",
    version: "Majordome fantôme",
    text: [
      {
        title: "Charge",
      },
      {
        title: "DERNIER ACTE",
        description:
          "Lorsque ce personnage est banni durant votre tour, vous pouvez placer la carte du dessus de votre pioche face cachée sous l'un de vos personnages ou de vos lieux ayant Boost.",
      },
    ],
  },
  it: {
    name: "Archie",
    version: "Maggiordomo Fantasma",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "ATTO FINALE",
        description:
          "Durante il tuo turno, quando questo personaggio viene esiliato, puoi mettere la prima carta del tuo mazzo a faccia in giù sotto a uno dei tuoi personaggi o luoghi con Potenziamento.",
      },
    ],
  },
};
