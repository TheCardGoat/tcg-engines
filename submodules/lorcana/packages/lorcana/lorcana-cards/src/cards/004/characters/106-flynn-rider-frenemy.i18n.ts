import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flynnRiderFrenemyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flynn Rider",
    version: "Frenemy",
    text: [
      {
        title: "NARROW ADVANTAGE",
        description:
          "At the start of your turn, if you have a character in play with more {S} than each opposing character, gain 3 lore.",
      },
    ],
  },
  de: {
    name: "Flynn Rider",
    version: "Freind",
    text: [
      {
        title: "KNAPPER VORSPRUNG",
        description:
          "Zu Beginn deines Zuges, wenn du einen Charakter mit einer höheren als die aller gegnerischen Charaktere im Spiel hast, sammelst du 3 Legenden.",
      },
    ],
  },
  fr: {
    name: "Flynn Rider",
    version: "Faux ami",
    text: [
      {
        title: "MINCE AVANTAGE",
        description:
          "Au début de votre tour, si vous avez un personnage en jeu avec une supérieure à celle de chaque personnage adverse en jeu, gagnez 3 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Flynn Rider",
    version: "Amico-Nemico",
    text: [
      {
        title: "VANTAGGIO LIMITATO",
        description:
          "All'inizio del tuo turno, se hai in gioco un personaggio con superiore a quella di ogni personaggio avversario, ottieni 3 leggenda.",
      },
    ],
  },
};
