import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theQueenCommandingPresenceI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Queen",
    version: "Commanding Presence",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "WHO IS THE FAIREST?",
        description:
          "Whenever this character quests, chosen opposing character gets -4 {S} this turn and chosen character gets +4 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Die Königin",
    version: "Imposantes Auftreten",
    text: [
      {
        title: "Gestaltwandel 2",
      },
      {
        title: "WER IST DIE SCHÖNSTE?",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du in diesem Zug einem gegnerischen Charakter deiner Wahl -4 und einem Charakter deiner Wahl +4 geben.",
      },
    ],
  },
  fr: {
    name: "La Reine",
    version: "Autorité naturelle",
    text: [
      {
        title: "Alter 2",
      },
      {
        title: "QUI EST LA PLUS BELLE?",
        description:
          "Lorsque ce personnage est envoyé à l'aventure, choisissez un personnage qui gagne +4 et un personnage adverse qui subit -4, pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "The Queen",
    version: "Commanding Presence",
    text: [
      {
        title: "Shift 2",
      },
      {
        title: "WHO IS THE FAIREST?",
        description:
          "Whenever this character quests, chosen opposing character gets -4 this turn and chosen character gets +4 this turn.",
      },
    ],
  },
};
