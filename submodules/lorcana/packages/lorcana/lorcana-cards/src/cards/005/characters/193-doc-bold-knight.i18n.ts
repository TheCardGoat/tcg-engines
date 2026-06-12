import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const docBoldKnightI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Doc",
    version: "Bold Knight",
    text: [
      {
        title: "DRASTIC MEASURES",
        description: "When you play this character, you may discard your hand to draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Chef",
    version: "Ritter der Kühnheit",
    text: [
      {
        title: "DRASTISCHE MASSNAHMEN",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du alle Karten von deiner Hand abwerfen, um 2 Karten zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Prof",
    version: "Chevalier hardi",
    text: [
      {
        title: "MESURES DRASTIQUES",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez défausser votre main pour piocher 2 cartes.",
      },
    ],
  },
  it: {
    name: "Dotto",
    version: "Cavaliere Audace",
    text: [
      {
        title: "MISURE DRASTICHE",
        description:
          "Quando giochi questo personaggio, puoi scartare la tua mano per pescare 2 carte.",
      },
    ],
  },
};
