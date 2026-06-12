import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stitchNaughtyExperimentI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stitch",
    version: "Naughty Experiment",
    text: [
      {
        title: "I DARE YOU!",
        description:
          "{E} — Chosen opposing character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
      },
    ],
  },
  de: {
    name: "Stitch",
    version: "Freches Experiment",
    text: [
      {
        title: "TRAU DICH!",
        description:
          "— Ein gegnerischer Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Impulsiv. (Der Charakter kann nicht erkunden und muss herausfordern, wenn möglich.)",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Expérience taquine",
    text: [
      {
        title: "T'OSERAS JAMAIS!",
        description:
          "— Choisissez un personnage adverse qui gagne Combattant jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Esperimento Impertinente",
    text: [
      {
        title: "TI SFIDO!",
        description:
          "— Un personaggio avversario a tua scelta ottiene Attaccabrighe fino all'inizio del tuo prossimo turno. (Non può andare all'avventura e deve sfidare, se possibile.)",
      },
    ],
  },
};
