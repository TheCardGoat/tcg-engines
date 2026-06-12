import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theMusesProclaimersOfHeroesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Muses",
    version: "Proclaimers of Heroes",
    text: [
      {
        title: "Ward",
      },
      {
        title: "THE GOSPEL TRUTH",
        description:
          "Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.",
      },
    ],
  },
  de: {
    name: "Die Musen",
    version: "Besingerinnen von Helden",
    text: [
      {
        title: "Behütet",
      },
      {
        title: "JEDES WORT IST WAHR!",
        description:
          "Jedes Mal, wenn du ein Lied ausspielst, darfst du einen Charakter deiner Wahl, mit 2 oder weniger, zurück auf die zugehörige Hand schicken.",
      },
    ],
  },
  fr: {
    name: "Les Muses",
    version: "Proclamatrices de héros",
    text: [
      {
        title: "Hors d'atteinte",
      },
      {
        title: "DU GOSPEL PUR",
        description:
          "Chaque fois que vous jouez une chanson, vous pouvez choisir un personnage avec 2 ou moins et le renvoyer dans la main de son propriétaire.",
      },
    ],
  },
  it: {
    name: "Le Muse",
    version: "Proclamatrici di Eroi",
    text: [
      {
        title: "Protetto",
      },
      {
        title: "QUESTA",
        description:
          "È LA REALTÀ Ogni volta che giochi una canzone, puoi far riprendere in mano al suo giocatore un personaggio a tua scelta con 2 o inferiore.",
      },
    ],
  },
};
