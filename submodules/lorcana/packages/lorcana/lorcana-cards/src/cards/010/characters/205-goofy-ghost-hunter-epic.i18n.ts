import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyGhostHunterEpicI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Ghost Hunter",
    text: [
      {
        title: "PERFECT TRAP",
        description:
          "When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Geisterjäger",
    text: [
      {
        title: "PERFEKTE FALLE",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Chasseur de fantômes",
    text: [
      {
        title: "LE PIÈGE PARFAIT",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Cacciatore di Fantasmi",
    text: [
      {
        title: "TRAPPOLA PERFETTA",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
