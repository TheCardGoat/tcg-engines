import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cogsworthClimbingClockI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cogsworth",
    version: "Climbing Clock",
    text: [
      {
        title: "STILL USEFUL",
        description: "While you have an item card in your discard, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Von Unruh",
    version: "Kletternde Uhr",
    text: [
      {
        title: "NOCH IMMER NÜTZLICH",
        description:
          "Solange du mindestens eine Gegenstandskarte in deinem Ablagestapel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Big Ben",
    version: "Horloge grimpeuse",
    text: [
      {
        title: "ENCORE UTILE",
        description:
          "Tant que vous avez une carte Objet dans votre défausse, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Tockins",
    version: "Orologio Scalatore",
    text: [
      {
        title: "ANCORA UTILE",
        description: "Mentre hai una carta oggetto nei tuoi scarti, questo personaggio riceve +2.",
      },
    ],
  },
};
