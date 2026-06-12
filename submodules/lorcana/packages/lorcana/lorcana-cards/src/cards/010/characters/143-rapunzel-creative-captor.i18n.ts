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
        title: "EINWICKELN",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl in diesem Zug -3.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Capture créative",
    text: [
      {
        title: "EMMÊLER",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Carceriera Creativa",
    text: [
      {
        title: "AVVOLGERE",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -3 per questo turno.",
      },
    ],
  },
};
