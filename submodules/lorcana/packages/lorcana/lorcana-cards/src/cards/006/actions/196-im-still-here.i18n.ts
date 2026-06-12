import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const imStillHereI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "I'm Still Here",
    text: "Chosen character gains Resist +2 until the start of your next turn. Draw a card.",
  },
  de: {
    name: "I'm Still Here",
    text: "Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Robust +2. Ziehe 1 Karte. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
  },
  fr: {
    name: "Un homme libre",
    text: "Choisissez un personnage qui gagne Résistance +2 jusqu'au début de votre prochain tour. Piochez une carte.",
  },
  it: {
    name: "Ci sono Anch'Io",
    text: "(Un personaggio con costo 3 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta ottiene Resistere +2 fino all'inizio del tuo prossimo turno. Pesca una carta.",
  },
};
