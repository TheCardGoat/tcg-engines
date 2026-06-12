import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pachaEmperorsGuideI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pacha",
    version: "Emperor's Guide",
    text: [
      {
        title: "HELPFUL SUPPLIES",
        description: "At the start of your turn, if you have an item in play, gain 1 lore.",
      },
      {
        title: "PERFECT DIRECTIONS",
        description: "At the start of your turn, if you have a location in play, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Patcha",
    version: "Reiseführer des Königs",
    text: [
      {
        title: "NÜTZLICHE HINWEISE",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Gegenstand im Spiel hast, sammelst du 1 Legende.",
      },
      {
        title: "PERFEKTE WEGBESCHREIBUNG",
        description:
          "Zu Beginn deines Zuges, wenn du mindestens einen Ort im Spiel hast, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Pacha",
    version: "Guide de l'Empereur",
    text: [
      {
        title: "MATÉRIEL PRATIQUE",
        description:
          "Au début de votre tour, si vous avez un objet en jeu, gagnez 1 éclat de Lore.",
      },
      {
        title: "INDICATIONS PARFAITES",
        description: "Au début de votre tour, si vous avez un lieu en jeu, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Pacha",
    version: "Guida dell'Imperatore",
    text: [
      {
        title: "UTILI PROVVISTE",
        description: "All'inizio del tuo turno, se hai in gioco un oggetto, ottieni 1 leggenda.",
      },
      {
        title: "INDICAZIONI IMPECCABILI",
        description: "All'inizio del tuo turno, se hai in gioco un luogo, ottieni 1 leggenda.",
      },
    ],
  },
};
