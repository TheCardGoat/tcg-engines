import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const diabloObedientRavenI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Diablo",
    version: "Obedient Raven",
    text: [
      {
        title: "FLY, MY PET!",
        description: "When this character is banished, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Diablo",
    version: "Ergebener Rabe",
    text: [
      {
        title: "FLIEG DAHIN, MEIN LIEBLING",
        description: "Wenn dieser Charakter verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Diablo",
    version: "Corbeau docile",
    text: [
      {
        title: "VOLE, MON MIGNON!",
        description: "Lorsque ce personnage est banni, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Diablo",
    version: "Corvo Obbediente",
    text: [
      {
        title: "VOLA, MIO DILETTO!",
        description: "Quando questo personaggio viene esiliato, puoi pescare una carta.",
      },
    ],
  },
};
