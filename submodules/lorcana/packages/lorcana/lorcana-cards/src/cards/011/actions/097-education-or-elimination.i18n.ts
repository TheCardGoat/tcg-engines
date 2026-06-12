import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const educationOrEliminationI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Education or Elimination",
    text: [
      {
        title: "Choose one:",
      },
      {
        title:
          "* Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.",
      },
      {
        title: "* Banish chosen damaged character.",
      },
    ],
    optionTexts: [
      "Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.",
      "Banish chosen damaged character.",
    ],
  },
  de: {
    name: "Erziehung oder Eliminierung",
    text: "Wähle eine Möglichkeit aus: • Ziehe 1 Karte. Wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges +1 und Wendig. • Verbanne einen beschädigten Charakter deiner Wahl.",
  },
  fr: {
    name: "L’éducation ou l’élimination",
    text: "Choisissez entre: • Piochez une carte. Choisissez l'un de vos personnages qui gagne +1 et Insaisissable jusqu'au début de votre prochain tour. • Choisissez un personnage ayant au moins un dommage et bannissez-le.",
  },
  it: {
    name: "Preparazione o Eliminazione",
    text: "(Un personaggio con costo 4 o superiore può per cantare questa canzone gratis.) Scegli uno: • Pesca una carta. Un tuo personaggio a tua scelta riceve +1 e ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.) • Esilia un personaggio danneggiato a tua scelta.",
  },
};
