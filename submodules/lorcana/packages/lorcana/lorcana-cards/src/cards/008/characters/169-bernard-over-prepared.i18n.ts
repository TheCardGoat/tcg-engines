import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bernardOverpreparedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bernard",
    version: "Over-Prepared",
    text: [
      {
        title: "GO DOWN THERE AND INVESTIGATE",
        description:
          "When you play this character, if you have an Ally character in play, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Bernard",
    version: "Übervorbereitet",
    text: [
      {
        title: "WIR MÜSSEN DORTHIN UND NACHFORSCHEN",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen Verbündeten im Spiel hast, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Bernard",
    version: "Paré à toute éventualité",
    text: [
      {
        title: "IL FAUT NOUS Y RENDRE SANS PLUS TARDER",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un personnage Allié en jeu, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Bernie",
    version: "Fin Troppo Preparato",
    text: [
      {
        title: "ANDARE LÌ AD INDAGARE",
        description:
          "Quando giochi questo personaggio, se hai in gioco un personaggio Alleato, puoi pescare una carta.",
      },
    ],
  },
};
