import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const standOutEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stand Out",
    text: "Chosen character gets +3 {S} and gains Evasive until the start of your next turn.",
  },
  de: {
    name: "Stand Out",
    text: "Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges +3 {S} und <Wendig>.",
  },
  fr: {
    name: "Stand Out",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 3 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage qui gagne +3 {S} et <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Stand Out",
    text: [
      {
        title:
          "(Un personaggio con costo 3 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta riceve +3 {S} e ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
