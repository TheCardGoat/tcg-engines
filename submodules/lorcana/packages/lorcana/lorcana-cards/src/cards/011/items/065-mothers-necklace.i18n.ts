import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mothersNecklaceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mother's Necklace",
    text: [
      {
        title: "PRECIOUS GIFT",
        description:
          "At the end of your turn, if none of your characters challenged this turn, chosen character of yours gains Evasive until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Mutters Halskette",
    text: [
      {
        title: "KOSTBARES GESCHENK",
        description:
          "Am Ende deines Zuges, falls in diesem Zug keiner deiner Charaktere herausgefordert hat, wähle einen deiner Charaktere. Jener erhält bis zu Beginn deines nächsten Zuges Wendig.",
      },
    ],
  },
  fr: {
    name: "Collier de la mère",
    text: [
      {
        title: "UN CADEAU PRÉCIEUX À",
        description:
          "la fin de votre tour, si aucun de vos personnages n'a défié ce tour-ci, choisissez l'un de vos personnages qui gagne Insaisissable jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Collana Materna",
    text: [
      {
        title: "DONO PREZIOSO",
        description:
          "Alla fine del tuo turno, se nessuno dei tuoi personaggi ha sfidato in questo turno, un tuo personaggio a tua scelta ottiene Sfuggente fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
