import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const standOutI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stand Out",
    text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn.",
  },
  de: {
    name: "Stand Out",
    text: "Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges +3 und Wendig.",
  },
  fr: {
    name: "Stand Out",
    text: "Choisissez un personnage qui gagne +3 et Insaisissable jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Stand Out",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta riceve +3 e ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
  },
};
