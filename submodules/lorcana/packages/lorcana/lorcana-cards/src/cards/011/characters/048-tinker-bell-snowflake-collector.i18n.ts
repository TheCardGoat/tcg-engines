import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tinkerBellSnowflakeCollectorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tinker Bell",
    version: "Snowflake Collector",
    text: [
      {
        title: "FLURRY OF DELIGHT",
        description: "While you have 4 or more cards in your hand, this character gains Evasive.",
      },
      {
        title: "SPECTACULAR FIND",
        description: "While you have 7 or more cards in your hand, this character gets +3 {L}.",
      },
    ],
  },
  de: {
    name: "Naseweis",
    version: "Schneeflockensammlerin",
    text: [
      {
        title: "WIRBELWIND DER FREUDE",
        description:
          "Solange du 4 oder mehr Karten auf deiner Hand hast, erhält dieser Charakter Wendig.",
      },
      {
        title: "SPEKTAKULÄRER FUND",
        description:
          "Solange du 7 oder mehr Karten auf deiner Hand hast, erhält dieser Charakter +3.",
      },
    ],
  },
  fr: {
    name: "La Fée Clochette",
    version: "Collectionneuse de flocons de neige",
    text: [
      {
        title: "AVALANCHE DE JOIE",
        description:
          "Tant que vous avez 4 cartes ou plus en main, ce personnage gagne Insaisissable.",
      },
      {
        title: "DÉCOUVERTE ÉPOUSTOUFLANTE",
        description: "Tant que vous avez 7 cartes ou plus en main, ce personnage gagne +3.",
      },
    ],
  },
  it: {
    name: "Trilli",
    version: "Collezionista di Fiocchi di Neve",
    text: [
      {
        title: "TURBINIO DI DELIZIA",
        description:
          "Mentre hai 4 o più carte in mano, questo personaggio ottiene Sfuggente. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
      {
        title: "RITROVAMENTO SPETTACOLARE",
        description: "Mentre hai 7 o più carte in mano, questo personaggio riceve +3.",
      },
    ],
  },
};
