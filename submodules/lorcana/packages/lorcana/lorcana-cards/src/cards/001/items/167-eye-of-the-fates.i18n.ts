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
        title: "DIE ZUKUNFT OFFENBAREN",
        description: "— Gib einem Charakter deiner Wahl in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "ŒIL DES MOIRES",
    text: [
      {
        title: "VOIR L'AVENIR",
        description: "— Choisissez un personnage, il gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Eye of the Fates",
    text: [
      {
        title: "SEE THE FUTURE",
        description: "— Chosen character gets +1 this turn.",
      },
    ],
  },
};
