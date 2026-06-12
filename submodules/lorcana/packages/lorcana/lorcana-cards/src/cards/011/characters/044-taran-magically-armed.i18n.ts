import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const taranMagicallyArmedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Taran",
    version: "Magically Armed",
    text: [
      {
        title: "Rush",
      },
      {
        title: "WEAKEN THE CAULDRON",
        description:
          "When you play this character, put up to 2 cards from chosen player's discard on the bottom of their deck in any order.",
      },
    ],
  },
  de: {
    name: "Taran",
    version: "Magisch bewaffnet",
    text: [
      {
        title: "Rasant",
      },
      {
        title: "SCHWÄCHE DEN KESSEL",
        description:
          "Wenn du diesen Charakter ausspielst, lege bis zu 2 Karten aus einem Ablagestapel deiner Wahl in beliebiger Reihenfolge unter das zugehörige Deck.",
      },
    ],
  },
  fr: {
    name: "Taram",
    version: "Magiquement armé",
    text: [
      {
        title: "Charge",
      },
      {
        title: "AFFAIBLIR LE CHAUDRON",
        description:
          "Lorsque vous jouez ce personnage, choisissez un joueur et placez jusqu'à 2 cartes de sa défausse sous sa pioche, dans l'ordre de votre choix.",
      },
    ],
  },
  it: {
    name: "Taron",
    version: "Armato Magicamente",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "INDEBOLIRE LA PENTOLA",
        description:
          "Quando giochi questo personaggio, metti fino a 2 carte dagli scarti di un giocatore a tua scelta in fondo al suo mazzo in qualsiasi ordine.",
      },
    ],
  },
};
