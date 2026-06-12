import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dopeyKnightApprenticeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dopey",
    version: "Knight Apprentice",
    text: [
      {
        title: "STRONGER TOGETHER",
        description:
          "When you play this character, if you have another Knight character in play, you may deal 1 damage to chosen character or location.",
      },
    ],
  },
  de: {
    name: "Seppl",
    version: "Ritterlehrling",
    text: [
      {
        title: "ZUSAMMEN STÄRKER",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen weiteren Ritter im Spiel hast, darfst du einem Charakter oder einem Ort deiner Wahl 1 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Simplet",
    version: "Chevalier en herbe",
    text: [
      {
        title: "L'UNION FAIT LA FORCE",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un autre personnage Chevalier en jeu, vous pouvez choisir un personnage ou un lieu et lui infliger 1 dommage.",
      },
    ],
  },
  it: {
    name: "Cucciolo",
    version: "Apprendista Cavaliere",
    text: [
      {
        title: "PIÙ FORTI INSIEME",
        description:
          "Quando giochi questo personaggio, se hai in gioco un altro personaggio Cavaliere, puoi infliggere 1 danno a un personaggio o a un luogo a tua scelta.",
      },
    ],
  },
};
