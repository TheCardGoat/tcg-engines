import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const meridaWispConjurerEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merida",
    version: "Wisp Conjurer",
    text: [
      {
        title: "FOCUSED ENERGY",
        description: "This character may enter play exerted to draw a card.",
      },
      {
        title: "BECKON",
        description:
          "During your turn, whenever another character of yours enters play exerted, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Merida",
    version: "Irrlichtbeschwörerin",
    text: [
      {
        title: "Fokussierte Energie",
        description: "Du darfst diesen Charakter erschöpft ausspielen, um 1 Karte zu ziehen.",
      },
      {
        title: "Winken",
        description:
          "Jedes Mal während deines Zuges, wenn du einen deiner anderen Charaktere erschöpft ausspielst, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Merida",
    version: "Conjuratrice de feux follets",
    text: [
      {
        title: "Énergie concentrée",
        description: "Ce personnage peut entrer en jeu épuisé pour piocher une carte.",
      },
      {
        title: "Faire signe",
        description:
          "Durant votre tour, chaque fois qu'un autre de vos personnages entre en jeu épuisé, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Merida",
    version: "Evocatrice di Fuochi Fatui",
    text: [
      {
        title: "Energia Mirata",
        description:
          "Questo personaggio può entrare in gioco impegnato per farti pescare una carta.",
      },
      {
        title: "Cenno",
        description:
          "Durante il tuo turno, ogni volta che un tuo altro personaggio entra in gioco impegnato, puoi pescare una carta.",
      },
    ],
  },
};
