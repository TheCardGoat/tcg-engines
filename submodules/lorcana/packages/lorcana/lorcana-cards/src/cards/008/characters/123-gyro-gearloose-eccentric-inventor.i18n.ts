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
        title: "Wendig",
      },
      {
        title: "ICH ZEIGE ES IHNEN!",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -3.",
      },
    ],
  },
  fr: {
    name: "Géo Trouvetou",
    version: "Inventeur excentrique",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "VOUS ALLEZ VOIR!",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Archimede Pitagorico",
    version: "Inventore Eccentrico",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "VE LO DIMOSTRERÒ!",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -3 per questo turno.",
      },
    ],
  },
};
