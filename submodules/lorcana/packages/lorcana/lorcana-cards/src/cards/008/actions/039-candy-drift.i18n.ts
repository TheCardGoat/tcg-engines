import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const candyDriftI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Candy Drift",
    text: "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
  },
  de: {
    name: "Zucker-Drift",
    text: "Ziehe 1 Karte. Wähle einen deiner Charaktere und gib ihm in diesem Zug +5. Verbanne ihn am Ende deines Zuges.",
  },
  fr: {
    name: "Dérapage sucré",
    text: "Piochez une carte. Choisissez l'un de vos personnages qui gagne +5 pour le reste de ce tour. Bannissez-le à la fin de ce tour.",
  },
  it: {
    name: "Drift Candito",
    text: "Pesca una carta. Un tuo personaggio a tua scelta riceve +5 per questo turno. Alla fine del tuo turno, esilialo.",
  },
};
