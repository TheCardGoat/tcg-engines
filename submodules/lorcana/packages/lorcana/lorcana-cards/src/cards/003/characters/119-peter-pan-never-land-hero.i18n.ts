import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanNeverLandHeroI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Never Land Hero",
    text: [
      {
        title: "Rush",
      },
      {
        title: "OVER HERE, TINK",
        description:
          "While you have a character named Tinker Bell in play, this character gets +2 {S}.",
      },
    ],
  },
  de: {
    name: "Peter Pan",
    version: "Held aus Nimmerland",
    text: [
      {
        title: "Rasant",
      },
      {
        title: "HIER DRÜBEN, NASEWEIS",
        description:
          "Solange du mindestens einen Naseweis-Charakter im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Peter Pan",
    version: "Héros du Pays Imaginaire",
    text: [
      {
        title: "Charge",
      },
      {
        title: "PAR ICI, FÉE CLOCHETTE",
        description:
          "Tant que vous avez un personnage La Fée Clochette en jeu, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Peter Pan",
    version: "Eroe dell'Isola Che Non C'è",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "DA QUESTA PARTE, TRILLI",
        description:
          "Mentre hai un personaggio chiamato Trilli in gioco, questo personaggio riceve +2.",
      },
    ],
  },
};
