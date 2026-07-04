import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelCreativeCaptorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel",
    version: "Creative Captor",
    text: [
      {
        title: "ENSNARL",
        description:
          "When you play this character, chosen opposing character gets -3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Rapunzel",
    version: "Kreative Fängerin",
    text: [
      {
        title: "Einwickeln",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl in diesem Zug -3 {S}.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Capture créative",
    text: [
      {
        title: "Emmêler",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Carceriera Creativa",
    text: [
      {
        title: "Avvolgere",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -3 {S} per questo turno.",
      },
    ],
  },
};
