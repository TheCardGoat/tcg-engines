import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const arielTreasureCollectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ariel",
    version: "Treasure Collector",
    text: [
      {
        title: "Ward",
      },
      {
        title: "THE GIRL WHO HAS EVERYTHING",
        description:
          "While you have more items in play than each opponent, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Arielle",
    version: "Schatzsammlerin",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "DIE, DIE SCHON ALLES HAT",
        description:
          "Wenn du mehr Gegenstände als jede gegnerische Person im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Ariel",
    version: "Collectionneuse de trésors",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "TROP GÂTÉE PAR LA VIE",
        description:
          "Tant que vous avez plus d'objets en jeu que chaque adversaire, ce personnage gagne +2.",
      },
    ],
  },
  it: {
    name: "Ariel",
    version: "Collezionista di Tesori",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "UNA CHE HA TUTTO ORMAI",
        description:
          "Mentre hai in gioco più oggetti di ogni avversario, questo personaggio riceve +2.",
      },
    ],
  },
};
