import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mushusRocketI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mushu's Rocket",
    text: [
      {
        title: "I NEED FIREPOWER",
        description:
          "When you play this item, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
      },
      {
        title: "HITCH A RIDE 2",
        description: "{I}, Banish this item — Chosen character gains Rush this turn.",
      },
    ],
  },
  de: {
    name: "Mushus Rakete",
    text: [
      {
        title: "Könnt ihr mir mal Feuer geben?",
        description:
          "Wenn du diesen Gegenstand ausspielst, erhält ein Charakter deiner Wahl in diesem Zug <Rasant>. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
      {
        title: "Mitfahren",
        description:
          "2 {I}, Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug <Rasant>.",
      },
    ],
  },
  fr: {
    name: "Fusée de Mushu",
    text: [
      {
        title: "Vous n'auriez pas du feu?",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage qui gagne <Charge> pour le reste de ce tour.",
      },
      {
        title: "Monture de fortune",
        description:
          "2 {I}, Bannissez cet objet — Choisissez un personnage qui gagne <Charge> pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Razzo di Mushu",
    text: [
      {
        title: "Voglio la Potenza del Fuoco",
        description:
          "Quando giochi questo oggetto, un personaggio a tua scelta ottiene <Lesto> per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
      {
        title: "Scroccare un Passaggio",
        description:
          "2 {I}, esilia questo oggetto — Un personaggio a tua scelta ottiene <Lesto> per questo turno.",
      },
    ],
  },
};
