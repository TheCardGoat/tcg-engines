import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastsCastleWinterGardensI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast's Castle",
    version: "Winter Gardens",
    text: [
      {
        title: "SNOWBALL STANDOFF",
        description: "Whenever a character here challenges another character, gain 1 lore.",
      },
    ],
  },
  de: {
    name: "Das Schloss des Biests",
    version: "Wintergärten",
    text: [
      {
        title: "Schneeballschlacht",
        description:
          "Jedes Mal, wenn einer deiner Charaktere an diesem Ort einen anderen Charakter herausfordert, sammelst du 1 Legende.",
      },
    ],
  },
  fr: {
    name: "Château de la Bête",
    version: "Jardins d'hiver",
    text: [
      {
        title: "Duel de boules de neige",
        description:
          "Chaque fois qu'un personnage sur ce lieu défie un autre personnage, gagnez 1 éclat de Lore.",
      },
    ],
  },
  it: {
    name: "Il Castello della Bestia",
    version: "Giardini Invernali",
    text: [
      {
        title: "Stallo di Palle di Neve",
        description:
          "Ogni volta che un personaggio in questo luogo sfida un altro personaggio, ottieni 1 leggenda.",
      },
    ],
  },
};
