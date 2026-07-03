import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyGhostHunterI18n: Record<Languages, I18nProperties> = {
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
        title: "Perfekte Falle",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Chasseur de fantômes",
    text: [
      {
        title: "Le piège parfait",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -1 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Cacciatore di Fantasmi",
    text: [
      {
        title: "Trappola Perfetta",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -1 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
