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
        title: "EXTRAKT AUS RUBIN 1,",
        description:
          "Verbanne diesen Gegenstand — Ein Charakter deiner Wahl erhält in diesem Zug +2 und Rasant. (Der Charakter kann im selben Zug herausfordern, in dem er ausgespielt wird.)",
      },
    ],
  },
  fr: {
    name: "Sphère de Vitalité",
    text: [
      {
        title: "EXTRAIT DE RUBIS 1,",
        description:
          "Bannissez cet objet — Choisissez un personnage qui gagne Charge et +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Vitalisfera",
    text: [
      {
        title: "ESTRATTO DI RUBINO 1,",
        description:
          "esilia questo oggetto — Un personaggio a tua scelta ottiene Lesto e riceve +2 per questo turno. (Può sfidare nel turno in cui viene giocato.)",
      },
    ],
  },
};
