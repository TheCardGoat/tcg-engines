import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const cinderellaDreamComeTrueEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cinderella",
    version: "Dream Come True",
    text: [
      {
        title: "WHATEVER YOU WISH FOR",
        description:
          "At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.",
      },
    ],
  },
  de: {
    name: "Cinderella",
    version: "Ein Traum ist wahr geworden",
    text: [
      {
        title: "DAS LEBEN, ES LACHT MIR DANN ZU",
        description:
          "Am Ende deines Zuges, falls du in diesem Zug mindestens 1 Prinzessin ausgespielt hast, darfst du 1 beliebige Karte aus deiner Hand verdeckt in deinen Tintenvorrat legen, um 1 Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Cendrillon",
    version: "Rêve qui se réalise",
    text: [
      {
        title: "LES RÊVES QUI SOMMEILLENT DANS NOS CŒURS À",
        description:
          "la fin de votre tour, si vous avez joué un personnage Princesse ce tour-ci, vous pouvez placer une carte de votre main dans votre réserve d'encre, face cachée, pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Cenerentola",
    version: "Sogno Divenuto Realtà",
    text: [
      {
        title: "TI ESPRIMI CON SINCERITÀ",
        description:
          "Alla fine del tuo turno, se hai giocato un personaggio Principessa in questo turno, puoi aggiungere una carta dalla tua mano al tuo calamaio, a faccia in giù, per pescare una carta.",
      },
    ],
  },
};
