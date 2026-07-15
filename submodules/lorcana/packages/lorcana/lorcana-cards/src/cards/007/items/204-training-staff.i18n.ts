import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const trainingStaffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Training Staff",
    text: [
      {
        title: "PRECISION STRIKE",
        description:
          "{E}, 1 {I} — Chosen character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
      },
    ],
  },
  de: {
    name: "Übungsstab",
    text: [
      {
        title: "Präzisionsschlag",
        description:
          "{E}, 1 {I} — Ein Charakter deiner Wahl erhält in diesem Zug <Herausfordern> +2. (Während der Charakter herausfordert, erhält er +2 {S}.)",
      },
    ],
  },
  fr: {
    name: "Bâton d’entraînement",
    text: [
      {
        title: "Frappe précise",
        description:
          "{E}, 1 {I} — Choisissez un personnage qui gagne <Offensif> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Bastone da Allenamento",
    text: [
      {
        title: "Colpo di Precisione",
        description:
          "{E}, 1 {I} — Un personaggio a tua scelta ottiene <Sfidante> +2 per questo turno. (Riceve +2 {S} mentre sta sfidando.)",
      },
    ],
  },
};
