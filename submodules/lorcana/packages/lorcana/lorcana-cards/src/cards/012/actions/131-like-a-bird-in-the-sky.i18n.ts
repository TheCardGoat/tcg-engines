import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const likeABirdInTheSkyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Like A Bird In the Sky",
    text: "Chosen character gets +1 {L} and gains Evasive until the start of your next turn.",
  },
  de: {
    name: "Wie ein Vogel so frei",
    text: "Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges +1 {L} und <Wendig>.",
  },
  fr: {
    name: "Je pourrais m'envoler",
    text: [
      {
        title:
          "(Vous pouvez {E} un personnage coûtant 2 ou plus pour chanter cette chanson gratuitement.)",
      },
      {
        title:
          "Choisissez un personnage qui gagne +1 {L} et <Insaisissable> jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Dove Volan gli Dei",
    text: [
      {
        title:
          "(Un personaggio con costo 2 o superiore può {E} per cantare questa canzone gratis.)",
      },
      {
        title:
          "Un personaggio a tua scelta riceve +1 {L} e ottiene <Sfuggente> fino all'inizio del tuo prossimo turno. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
