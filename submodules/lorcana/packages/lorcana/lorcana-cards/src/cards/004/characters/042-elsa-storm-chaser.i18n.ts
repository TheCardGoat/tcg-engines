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
        title: "Stürmische Zeiten",
        description:
          "{E} — Ein Charakter deiner Wahl erhält in diesem Zug <Herausfordern> +2 und <Rasant>. (Während der Charakter herausfordert, erhält er +2 {S}. Er kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Elsa",
    version: "Chasseuse d'orage",
    text: [
      {
        title: "Tempête",
        description:
          "{E} — Choisissez un personnage qui gagne <Offensif> +2 et <Charge> pour le reste de ce tour. (Lorsqu'il défie, ce personnage gagne +2 {S}. Ce personnage peut défier le tour où il est joué.)",
      },
    ],
  },
  it: {
    name: "Elsa",
    version: "Cacciatrice di Tempeste",
    text: [
      {
        title: "Tempesta",
        description:
          "{E} — Un personaggio a tua scelta ottiene <Sfidante> +2 e <Lesto> per questo turno. (Riceve +2 {S} mentre sta sfidando. Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
  es: {
    name: "Elsa",
    version: "Cazador de tormentas",
    text: [
      {
        title: "TEMPESTAD",
        description:
          "{E}: el personaje elegido obtiene Challenger +2 y Rush este turno. (Obtienen +2 {S} mientras desafían. Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
