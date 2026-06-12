import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kristoffReindeerKeeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kristoff",
    version: "Reindeer Keeper",
    text: [
      {
        title: "SONG OF THE HERD",
        description:
          "For each song card in your discard, you pay 1 {I} less to play this character.",
      },
      {
        title: "Bodyguard",
      },
    ],
  },
  de: {
    name: "Kristoff",
    version: "Rentier Hüter",
    text: [
      {
        title: "GESANG DER HERDE",
        description:
          "Für jede Liedkarte in deinem Ablagestapel, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
      {
        title: "Beschützen",
      },
    ],
  },
  fr: {
    name: "Kristoff",
    version: "Garde-rennes",
    text: [
      {
        title: "CHANT DU TROUPEAU",
        description:
          "Jouer ce personnage vous coûte 1 de moins par carte Chanson dans votre défausse.",
      },
      {
        title: "Rempart",
      },
    ],
  },
  it: {
    name: "Kristoff",
    version: "Custode delle Renne",
    text: [
      {
        title: "CANZONE DEL BRANCO",
        description:
          "Per ogni carta canzone nei tuoi scarti, paga 1 in meno per giocare questo personaggio.",
      },
      {
        title: "Guardiano",
      },
    ],
  },
};
