import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicBroomIlluminaryKeeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Broom",
    version: "Illuminary Keeper",
    text: [
      {
        title: "NICE AND TIDY",
        description:
          "Whenever you play another character, you may banish this character to draw a card.",
      },
    ],
  },
  de: {
    name: "Zauberbesen",
    version: "Hüter des Illuminarium",
    text: [
      {
        title: "SCHÖN UND ORDENTLICH",
        description:
          "Jedes Mal, wenn du einen anderen Charakter ausspielst, darfst du diesen Charakter verbannen, um 1 Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Balais Magiques",
    version: "Gardien de l'Illuminarium",
    text: [
      {
        title: "PROPRE ET RANGÉ",
        description:
          "Chaque fois que vous jouez un autre personnage, vous pouvez bannir ce personnage-ci pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Scopa Magica",
    version: "Custode dell'Illuminarium",
    text: [
      {
        title: "BELLO ORDINATO",
        description:
          "Ogni volta che giochi un altro personaggio, puoi esiliare questo personaggio per pescare una carta.",
      },
    ],
  },
};
