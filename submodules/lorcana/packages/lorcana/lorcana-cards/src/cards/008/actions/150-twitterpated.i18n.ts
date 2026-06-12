import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const twitterpatedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Twitterpated",
    text: "Chosen character gains Evasive until the start of your next turn.",
  },
  de: {
    name: "Schwer verknallt",
    text: "Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Wendig.",
  },
  fr: {
    name: "Batifolage",
    text: "Choisissez un personnage qui gagne Insaisissable jusqu'au début de votre prochain tour.",
  },
  it: {
    name: "Rincitrullulito",
    text: "Un personaggio a tua scelta ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
  },
};
