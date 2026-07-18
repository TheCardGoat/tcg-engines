import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theSwordReleasedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Sword Released",
    text: [
      {
        title: "POWER APPOINTED",
        description:
          "At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
      },
    ],
  },
  de: {
    name: "Das befreite Schwert",
    text: [
      {
        title: "Erteilte Macht",
        description:
          "Zu Beginn deines Zuges, wenn du einen Charakter mit einer höheren {S} als die {S} aller gegnerischen Charaktere im Spiel hast, verlieren alle gegnerischen Mitspielenden je 1 Legende und du sammlest, für jede so verlorene Legende, je 1 Legende.",
      },
    ],
  },
  fr: {
    name: "L'Épée libérée",
    text: [
      {
        title: "La puissance est conférée",
        description:
          "Au début de votre tour, si vous avez un personnage en jeu avec une {S} plus élevée que chaque personnage adverse, chaque adversaire perd 1 éclat de Lore. Vous gagnez autant d'éclats de Lore que vos adversaires en ont perdu.",
      },
    ],
  },
  it: {
    name: "La Spada Estratta",
    text: [
      {
        title: "Designato dal Potere",
        description:
          "All'inizio del tuo turno, se hai in gioco un personaggio con più {S} di ogni personaggio avversario in gioco, ogni avversario perde 1 leggenda e tu ottieni leggenda pari alla leggenda persa.",
      },
    ],
  },
  es: {
    name: "La espada liberada",
    text: [
      {
        title: "PODER NOMBRADO",
        description:
          "Al comienzo de tu turno, si tienes un personaje en juego con más {S} que cada personaje contrario en juego, cada oponente pierde 1 conocimiento y tú ganas un conocimiento igual al conocimiento perdido.",
      },
    ],
  },
};
