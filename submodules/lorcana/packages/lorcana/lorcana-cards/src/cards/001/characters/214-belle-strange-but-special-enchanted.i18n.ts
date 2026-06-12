import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const belleStrangeButSpecialEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Belle",
    version: "Strange but Special",
    text: [
      {
        title: "READ A BOOK",
        description:
          "During your turn, you may put an additional card from your hand into your inkwell facedown.",
      },
      {
        title: "MY FAVORITE PART!",
        description: "While you have 10 or more cards in your inkwell, this character gets +4 {L}.",
      },
    ],
  },
  de: {
    name: "Belle",
    version: "Eine ganz besondere Mademoiselle",
    text: [
      {
        title: "LIES EIN BUCH!",
        description: "Du darfst in deinem Zug 1 weitere Karte tinten.",
      },
      {
        title: "MEIN LIEBLINGSBUCH",
        description:
          "Solange du 10 oder mehr Karten in deinem Tintenvorrat hast, erhält dieser Charakter +4.",
      },
    ],
  },
  fr: {
    name: "BELLE",
    version: "Étrange demoiselle",
    text: [
      {
        title: "LIRE UN LIVRE",
        description: "Durant votre tour, vous pouvez encrer une carte supplémentaire.",
      },
      {
        title: "MON PASSAGE PRÉFÉRÉ!",
        description:
          "Tant que vous avez 10 cartes ou plus dans votre réserve d'encre, ce personnage gagne +4.",
      },
    ],
  },
  it: {
    name: "Belle",
    version: "Strange but Special",
    text: [
      {
        title: "READ A BOOK",
        description: "During your turn, you may ink an additional card.",
      },
      {
        title: "MY FAVORITE PART!",
        description: "While you have 10 or more cards in your inkwell, this character gets +4.",
      },
    ],
  },
};
