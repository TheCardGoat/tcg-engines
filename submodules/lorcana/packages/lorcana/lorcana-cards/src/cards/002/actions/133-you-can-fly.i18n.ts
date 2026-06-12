import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const youCanFlyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "You Can Fly!",
    text: "Chosen character gains Evasive until the start of your next turn.",
  },
  de: {
    name: "Flieg ins Glück",
    text: "Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Wendig.",
  },
  fr: {
    name: "Tu t'envoles",
    text: "Choisissez un personnage, il gagne Insaisissable jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Puoi Volar!",
    text: "(Un personaggio con costo 2 o superiore può per cantare questa canzone gratis.) Un personaggio a tua scelta ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
  },
};
