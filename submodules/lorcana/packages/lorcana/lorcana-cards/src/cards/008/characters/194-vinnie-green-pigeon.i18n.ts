import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const vinnieGreenPigeonI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vinnie",
    version: "Green Pigeon",
    text: [
      {
        title: "LEARNING EXPERIENCE",
        description:
          "During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Vinnie",
    version: "Grüne Taube",
    text: [
      {
        title: "LEHRSAME ERFAHRUNG",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere im Zug einer gegnerischen Person verbannt wird, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Vinnie le pigeon",
    version: "Pigeon vert",
    text: [
      {
        title: "EXPÉRIENCE ENRICHISSANTE",
        description:
          "Durant le tour de vos adversaires, chaque fois qu'un autre de vos personnages est banni, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Vinnie",
    version: "Piccione Verde",
    text: [
      {
        title: "ESPERIENZA FORMATIVA",
        description:
          "Durante il turno di un avversario, ogni volta che un tuo altro personaggio viene esiliato, ottieni 1 leggenda.",
      },
    ],
  },
};
