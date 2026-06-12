import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const maleficentSorceressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maleficent",
    version: "Sorceress",
    text: [
      {
        title: "CAST MY SPELL!",
        description: "When you play this character, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Malefiz",
    version: "Hexerin",
    text: [
      {
        title: "WIRKE MEINEN ZAUBER!",
        description: "Wenn du diesen Charakter ausspielst, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "MALÉFIQUE",
    version: "Sorcière",
    text: [
      {
        title: "SORTILÈGE",
        description: "Lorsque vous jouez ce personnage, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Malefica",
    version: "Incantatrice",
    text: [
      {
        title: "OSCURA FORZA",
        description: "Quando giochi questo personaggio, puoi pescare una carta.",
      },
    ],
  },
};
