import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const gazelleBalladSingerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Gazelle",
    version: "Ballad Singer",
    text: [
      {
        title: "Singer 7",
      },
      {
        title: "CROWD FAVORITE",
        description:
          "When you play this character, you may put a song card from your discard on the top of your deck.",
      },
    ],
  },
  de: {
    name: "Gazelle",
    version: "Balladensängerin",
    text: [
      {
        title: "<Singen> 7 (Die Kosten dieses Charakters gelten als 7 für das Singen von Liedern.)",
      },
      {
        title: "Publikumsliebling",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Liedkarte aus deinem Ablagestapel wählen und als oberste Karte auf dein Deck legen.",
      },
    ],
  },
  fr: {
    name: "Gazelle",
    version: "Chanteuse de slow",
    text: [
      {
        title:
          "<Mélomane> 7 (Ce personnage est considéré comme ayant un coût de 7 pour chanter des chansons.)",
      },
      {
        title: "Favorite du public",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez placer sur votre pioche une carte Chanson de votre défausse.",
      },
    ],
  },
  it: {
    name: "Gazelle",
    version: "Cantante di Ballate",
    text: [
      {
        title: "<Melodioso> 7",
      },
      {
        title: "Amata dalla Folla",
        description:
          "Quando giochi questo personaggio, puoi mettere una carta canzone dai tuoi scarti in cima al tuo mazzo.",
      },
    ],
  },
};
