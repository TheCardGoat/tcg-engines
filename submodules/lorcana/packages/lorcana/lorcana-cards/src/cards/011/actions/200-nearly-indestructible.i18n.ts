import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const nearlyIndestructibleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Nearly Indestructible",
    text: "Chosen character of yours gains Resist +2 until the start of your next turn.",
  },
  de: {
    name: "Beinahe unzerstörbar",
    text: "Wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges Robust +2. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
  },
  fr: {
    name: "Presque invincible",
    text: "Choisissez l'un de vos personnages qui gagne Résistance +2 jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Praticamente Indistruttibile",
    text: "Un tuo personaggio a tua scelta ottiene Resistere +2 fino all'inizio del tuo prossimo turno.",
  },
};
