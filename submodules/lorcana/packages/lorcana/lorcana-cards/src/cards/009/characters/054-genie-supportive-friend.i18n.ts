import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieSupportiveFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Supportive Friend",
    text: [
      {
        title: "THREE WISHES",
        description:
          "Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Hilfsbereiter Freund",
    text: [
      {
        title: "DREI WÜNSCHE",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du diese Karte in dein Deck mischen, um 3 Karten zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Ami encourageant",
    text: [
      {
        title: "TROIS VŒUX",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez le remélanger dans votre pioche, puis piocher 3 cartes.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Amico Solidale",
    text: [
      {
        title: "TRE DESIDERI",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi rimescolare questa carta nel mazzo per pescare 3 carte.",
      },
    ],
  },
};
