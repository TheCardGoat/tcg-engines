import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const medalOfHeroesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Medal of Heroes",
    text: [
      {
        title: "CONGRATULATIONS, SOLDIER",
        description:
          "{E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Medaille der Helden",
    text: [
      {
        title: "MEINEN",
        description:
          "GLÜCKWUNSCH, SOLDAT, 2, Verbanne diesen Gegenstand — Wähle einen deiner Charaktere und gib ihm in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Médaille des Héros",
    text: [
      {
        title: "JE TE",
        description:
          "FÉLICITE, SOLDAT, 2, bannissez cet objet — Choisissez l'un de vos personnages qui gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Medaglia degli Eroi",
    text: [
      {
        title: "CONGRATULAZIONI, SOLDATO, 2,",
        description:
          "esilia questo oggetto — Un tuo personaggio a tua scelta riceve +2 per questo turno.",
      },
    ],
  },
};
