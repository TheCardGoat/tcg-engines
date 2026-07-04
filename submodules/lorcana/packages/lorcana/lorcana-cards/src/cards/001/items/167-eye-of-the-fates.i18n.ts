import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const eyeOfTheFatesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Eye of the Fates",
    text: [
      {
        title: "SEE THE FUTURE",
        description: "{E} — Chosen character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Auge der Moiren",
    text: [
      {
        title: "Die Zukunft Offenbaren",
        description: "{E} — Gib einem Charakter deiner Wahl in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "ŒIL DES MOIRES",
    text: [
      {
        title: "VOIR L'AVENIR",
        description: "{E} — Choisissez un personnage, il gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Eye of the Fates",
    text: [
      {
        title: "See the Future",
        description: "{E} — Chosen character gets +1 {L} this turn.",
      },
    ],
  },
};
