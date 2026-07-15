import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gyroGearlooseEccentricInventorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gyro Gearloose",
    version: "Eccentric Inventor",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "I'LL SHOW YOU!",
        description:
          "When you play this character, chosen opposing character gets -3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Daniel Düsentrieb",
    version: "Exzentrischer Erfinder",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Ich zeige es ihnen!",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -3 {S}.",
      },
    ],
  },
  fr: {
    name: "Géo Trouvetou",
    version: "Inventeur excentrique",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Vous allez voir!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Archimede Pitagorico",
    version: "Inventore Eccentrico",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Ve lo Dimostrerò!",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -3 {S} per questo turno.",
      },
    ],
  },
};
