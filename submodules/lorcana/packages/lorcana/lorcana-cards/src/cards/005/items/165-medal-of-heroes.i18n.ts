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
        title: "Meinen Glückwunsch, Soldat",
        description:
          "{E}, 2 {I}, Verbanne diesen Gegenstand — Wähle einen deiner Charaktere und gib ihm in diesem Zug +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Médaille des Héros",
    text: [
      {
        title: "Je te félicite, soldat",
        description:
          "{E}, 2 {I}, bannissez cet objet — Choisissez l'un de vos personnages qui gagne +2 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Medaglia degli Eroi",
    text: [
      {
        title: "Congratulazioni, Soldato",
        description:
          "{E}, 2 {I}, esilia questo oggetto — Un tuo personaggio a tua scelta riceve +2 {L} per questo turno.",
      },
    ],
  },
};
