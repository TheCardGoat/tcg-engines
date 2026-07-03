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
  },
  de: {
    name: "Erziehung oder Eliminierung",
    text: [
      {
        title: "Wähle eine Möglichkeit aus:",
      },
      {
        title:
          "• Ziehe 1 Karte. Wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges +1 {L} und <Wendig>.",
      },
      {
        title: "• Verbanne einen beschädigten Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "L’éducation ou l’élimination",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 4 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title: "Choisissez entre:",
      },
      {
        title:
          "• Piochez une carte. Choisissez l'un de vos personnages qui gagne +1 {L} et <Insaisissable> jusqu'au début de votre prochain tour.",
      },
      {
        title: "• Choisissez un personnage ayant au moins un dommage et bannissez-le.",
      },
    ],
  },
  it: {
    name: "Preparazione o Eliminazione",
    text: [
      {
        title:
          "(Un personaggio con costo 4 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title: "Scegli uno:",
      },
      {
        title:
          "• Pesca una carta. Un tuo personaggio a tua scelta riceve +1 {L} e ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
      {
        title: "• Esilia un personaggio danneggiato a tua scelta.",
      },
    ],
  },
};
