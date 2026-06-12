import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const elsaStormChaserI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Elsa",
    version: "Storm Chaser",
    text: [
      {
        title: "TEMPEST",
        description:
          "{E} — Chosen character gains Challenger +2 and Rush this turn. (They get +2 {S} while challenging. They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Elsa",
    version: "Sturmjägerin",
    text: [
      {
        title: "STÜRMISCHE ZEITEN",
        description:
          "— Ein Charakter deiner Wahl erhält in diesem Zug Herausfordern +2 und Rasant. (Während der Charakter herausfordert, erhält er +2. Er kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Elsa",
    version: "Chasseuse d'orage",
    text: [
      {
        title: "TEMPÊTE",
        description:
          "— Choisissez un personnage qui gagne Offensif +2 et Charge pour le reste de ce tour. (Lorsqu'il défie, ce personnage gagne +2. Ce personnage peut défier le tour où il est joué.)",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Cacciatrice di Tempeste",
    text: [
      {
        title: "TEMPESTA",
        description:
          "— Un personaggio a tua scelta ottiene Sfidante +2 e Lesto per questo turno. (Riceve +2 mentre sta sfidando. Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
