import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kuzcoPanickedLlamaI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kuzco",
    version: "Panicked Llama",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "WE CAN FIGURE THIS OUT",
        description: "At the start of your turn, choose one:",
      },
      {
        title: "• Each player draws a card.",
      },
      {
        title: "• Each player chooses and discards a card.",
      },
    ],
  },
  de: {
    name: "Kusco",
    version: "Panisches Lama",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "UNS WIRD SCHON WAS EINFALLEN",
        description:
          "Zu Beginn deines Zuges, wähle eine Möglichkeit aus: • Alle Mitspielenden (auch du) ziehen je 1 Karte. • Alle Mitspielenden (auch du) wählen je 1 Karte aus ihrer Hand und werfen sie ab.",
      },
    ],
  },
  fr: {
    name: "Kuzco",
    version: "Lama en panique",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "ON VA TROUVER UNE SOLUTION",
        description:
          "Au début de votre tour, choisissez entre: • Chaque joueur pioche une carte. • Chaque joueur défausse une carte.",
      },
    ],
  },
  it: {
    name: "Kuzco",
    version: "Lama Impanicato",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "RIUSCIREMO",
        description:
          "A CAVARCELA All'inizio del tuo turno, scegli uno: • Ogni giocatore pesca una carta. • Ogni giocatore sceglie e scarta una carta.",
      },
    ],
  },
};
