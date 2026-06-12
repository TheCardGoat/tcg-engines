import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastRelentlessI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast",
    version: "Relentless",
    text: [
      {
        title: "SECOND WIND",
        description: "Whenever an opposing character takes damage, you may ready this character.",
      },
    ],
  },
  de: {
    name: "Biest",
    version: "Unerbittlich",
    text: [
      {
        title: "NEUER AUFSCHWUNG",
        description:
          "Jedes Mal, wenn ein gegnerischer Charakter Schaden erhält, darfst du diesen Charakter bereit machen.",
      },
    ],
  },
  fr: {
    name: "La Bête",
    version: "Implacable",
    text: [
      {
        title: "SECOND SOUFFLE",
        description:
          "Chaque fois que des dommages sont infligés à un personnage adverse, vous pouvez redresser ce personnage.",
      },
    ],
  },
  it: {
    name: "Beast",
    version: "Relentless",
    text: [
      {
        title: "SECOND WIND",
        description: "Whenever an opposing character is damaged, you may ready this character.",
      },
    ],
  },
};
