import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const buzzLightyearJungleRangerIconicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Buzz Lightyear",
    version: "Jungle Ranger",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "TAKE CHARGE",
        description:
          "When you play this character, you may return an action card with cost 7 or less from your discard to your hand.",
      },
      {
        title: "ADVANCED TRAINING",
        description: "Whenever you play an action, chosen character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Buzz Lightyear",
    version: "Dschungel-Ranger",
    text: [
      {
        title: "<Gestaltwandel> 5 {I}",
      },
      {
        title: "Verantwortung übernehmen",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Aktionskarte aus deinem Ablagestapel, die 7 oder weniger kostet, zurück auf deine Hand nehmen.",
      },
      {
        title: "Spezialtraining",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Buzz l'Éclair",
    version: "Ranger de la jungle",
    text: [
      {
        title: "<Alter> 5 {I}",
      },
      {
        title: "Prend les commandes",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez renvoyer dans votre main une carte Action coûtant 7 ou moins de votre défausse.",
      },
      {
        title: "Entraînement avancé",
        description:
          "Chaque fois que vous jouez une action, choisissez un personnage qui gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Buzz Lightyear",
    version: "Ranger della Giungla",
    text: [
      {
        title: "<Trasformazione> 5 {I}",
      },
      {
        title: "Prendere il Comando",
        description:
          "Quando giochi questo personaggio, puoi riprendere in mano una carta azione con costo 7 o inferiore dai tuoi scarti.",
      },
      {
        title: "Addestramento Avanzato",
        description:
          "Ogni volta che giochi un'azione, un personaggio a tua scelta riceve +1 {L} per questo turno.",
      },
    ],
  },
};
