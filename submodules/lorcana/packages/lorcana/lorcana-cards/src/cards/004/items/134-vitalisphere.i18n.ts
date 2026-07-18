import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const vitalisphereI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vitalisphere",
    text: [
      {
        title: "EXTRACT OF RUBY 1",
        description:
          "{I}, Banish this item — Chosen character gains Rush and gets +2 {S} this turn. (They can challenge the turn they're played.)",
      },
    ],
  },
  de: {
    name: "Vitalisphäre",
    text: [
      {
        title: "Extrakt aus Rubin",
        description:
          "1 {I}, Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug +2 {S} und <Rasant>. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Sphère de Vitalité",
    text: [
      {
        title: "Extrait de Rubis",
        description:
          "1 {I}, Bannissez cet objet — Choisissez un personnage qui gagne <Charge> et +2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Vitalisfera",
    text: [
      {
        title: "Estratto di Rubino",
        description:
          "1 {I}, esilia questo oggetto — Un personaggio a tua scelta ottiene <Lesto> e riceve +2 {S} per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
  es: {
    name: "Vitalisferio",
    text: [
      {
        title: "EXTRACTO DE RUBÍ 1",
        description:
          "{I}, destierra este objeto: el personaje elegido gana Rush y obtiene +2 {S} este turno. (Pueden desafiar el turno en el que se juega).",
      },
    ],
  },
};
