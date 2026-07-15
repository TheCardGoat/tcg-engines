import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mirageSuperRecruiterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mirage",
    version: "Super Recruiter",
    text: [
      {
        title: "BUSINESS ARRANGEMENT",
        description:
          "When you play this character, if you have a Super or Hero character in play, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Mirage",
    version: "Super-Personalvermittlerin",
    text: [
      {
        title: "Geschäftliche Vereinbarung",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen Super oder Helden im Spiel hast, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Mirage",
    version: "Recruteuse de Supers",
    text: [
      {
        title: "Partenariat d'affaires",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un personnage Super ou Héros en jeu, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Mirage",
    version: "Reclutatrice di Super",
    text: [
      {
        title: "Accordo d'Affari",
        description:
          "Quando giochi questo personaggio, se hai in gioco un personaggio Super o Eroe, puoi pescare una carta.",
      },
    ],
  },
};
