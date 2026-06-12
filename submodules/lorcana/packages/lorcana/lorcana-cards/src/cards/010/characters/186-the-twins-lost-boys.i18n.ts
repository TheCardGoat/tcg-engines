import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theTwinsLostBoysI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Twins",
    version: "Lost Boys",
    text: [
      {
        title: "TWO FOR ONE",
        description:
          "When you play this character, if you have a location in play, you may deal 2 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Die Zwillinge",
    version: "Verwunschene Kinder",
    text: [
      {
        title: "ZWEI FÜR EINEN",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen Ort im Spiel hast, darfst du einem Charakter deiner Wahl 2 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Les jumeaux",
    version: "Enfants perdus",
    text: [
      {
        title: "DEUX POUR LE PRIX D'UN",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un lieu en jeu, vous pouvez choisir un personnage et lui infliger 2 dommages.",
      },
    ],
  },
  it: {
    name: "I Gemelli",
    version: "Bimbi Sperduti",
    text: [
      {
        title: "DUE PER UNO",
        description:
          "Quando giochi questo personaggio, se hai in gioco un luogo, puoi infliggere 2 danni a un personaggio a tua scelta.",
      },
    ],
  },
};
