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
        title: "KÖNNT IHR MIR MAL FEUER GEBEN?",
        description:
          "Wenn du diesen Gegenstand ausspielst, erhält ein Charakter deiner Wahl in diesem Zug Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
      {
        title: "MITFAHREN 2,",
        description:
          "Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug Rasant.",
      },
    ],
  },
  fr: {
    name: "Fusée de Mushu",
    text: [
      {
        title: "VOUS N'AURIEZ PAS DU FEU?",
        description:
          "Lorsque vous jouez cet objet, choisissez un personnage qui gagne Charge pour le reste de ce tour.",
      },
      {
        title: "MONTURE DE FORTUNE 2,",
        description:
          "Bannissez cet objet — Choisissez un personnage qui gagne Charge pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Razzo di Mushu",
    text: [
      {
        title: "VOGLIO LA POTENZA DEL FUOCO",
        description:
          "Quando giochi questo oggetto, un personaggio a tua scelta ottiene Lesto per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
      {
        title: "SCROCCARE UN PASSAGGIO 2,",
        description:
          "esilia questo oggetto — Un personaggio a tua scelta ottiene Lesto per questo turno.",
      },
    ],
  },
};
