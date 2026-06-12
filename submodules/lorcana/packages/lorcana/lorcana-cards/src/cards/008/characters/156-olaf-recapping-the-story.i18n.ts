import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const olafRecappingTheStoryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Olaf",
    version: "Recapping the Story",
    text: [
      {
        title: "ENDLESS TALE",
        description:
          "When you play this character, chosen opposing character gets -1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Olaf",
    version: "Fasst die Geschichte zusammen",
    text: [
      {
        title: "UNENDLICHE ERZÄHLUNG",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl in diesem Zug -1.",
      },
    ],
  },
  fr: {
    name: "Olaf",
    version: "Résumant l’histoire",
    text: [
      {
        title: "RÉCIT SANS FIN",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Olaf",
    version: "Che Riassume la Storia",
    text: [
      {
        title: "RACCONTO INFINITO",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -1 per questo turno.",
      },
    ],
  },
};
