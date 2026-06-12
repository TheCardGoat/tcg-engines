import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicaDeSpellConnivingSorceressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magica De Spell",
    version: "Conniving Sorceress",
    text: [
      {
        title: "Shift 7 {I}",
      },
      {
        title: "SHADOW'S GRASP",
        description:
          "When you play this character, if you used Shift to play her, you may draw 4 cards.",
      },
    ],
  },
  de: {
    name: "Gundel Gaukeley",
    version: "Hinterhältige Zauberin",
    text: [
      {
        title: "Gestaltwandel 7",
      },
      {
        title: "GRIFF DES SCHATTENS",
        description:
          "Wenn du diesen Charakter mithilfe von Gestaltwandel ausspielst, darfst du 4 Karten ziehen.",
      },
    ],
  },
  fr: {
    name: "Miss Tick",
    version: "Sorcière machiavélique",
    text: [
      {
        title: "Alter 7",
      },
      {
        title: "EMPRISE DE L'OMBRE",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité Alter, vous pouvez piocher 4 cartes.",
      },
    ],
  },
  it: {
    name: "Amelia",
    version: "Strega Subdola",
    text: [
      {
        title: "Trasformazione 7",
      },
      {
        title: "NELLE GRINFIE DELL'OMBRA",
        description:
          "Quando giochi questo personaggio, se hai usato Trasformazione per giocarlo, puoi pescare 4 carte.",
      },
    ],
  },
};
