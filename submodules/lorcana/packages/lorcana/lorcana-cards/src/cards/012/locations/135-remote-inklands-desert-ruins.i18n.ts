import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const remoteInklandsDesertRuinsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Remote Inklands",
    version: "Desert Ruins",
    text: [
      {
        title: "ERODING WINGS",
        description: "At the start of your turn, put the top card of your deck into your discard.",
      },
      {
        title: "SUCCESSFUL EXPEDITION",
        description: "Characters get +2 {S} while here.",
      },
    ],
  },
  de: {
    name: "Entfernte Tintenlande",
    version: "Wüstenruinen",
    text: [
      {
        title: "Zerstörerische Winde",
        description:
          "Zu Beginn deines Zuges, lege die oberste Karte deines Decks auf deinen Ablagestapel.",
      },
      {
        title: "Erfolgreiche Expedition",
        description: "Charaktere an diesem Ort erhalten +2 {S}.",
      },
    ],
  },
  fr: {
    name: "Terres d'encres reculées",
    version: "Ruines du désert",
    text: [
      {
        title: "Vents érosifs",
        description:
          "Au début de votre tour, placez la carte du dessus de votre pioche dans votre défausse.",
      },
      {
        title: "Expédition réussie",
        description: "Les personnages sur ce lieu gagnent +2 {S}.",
      },
    ],
  },
  it: {
    name: "Terre d'Inchiostro Remote",
    version: "Rovine Desertiche",
    text: [
      {
        title: "Venti Erosivi",
        description:
          "All'inizio del tuo turno, metti la prima carta del tuo mazzo nei tuoi scarti.",
      },
      {
        title: "Spedizione Riuscita",
        description: "I personaggi ricevono +2 {S} mentre si trovano in questo luogo.",
      },
    ],
  },
};
