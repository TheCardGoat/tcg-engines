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
        title: "Wirbelwind der Freude",
        description:
          "Solange du 4 oder mehr Karten auf deiner Hand hast, erhält dieser Charakter <Wendig>.",
      },
      {
        title: "Spektakulärer Fund",
        description:
          "Solange du 7 oder mehr Karten auf deiner Hand hast, erhält dieser Charakter +3 {L}.",
      },
    ],
  },
  fr: {
    name: "La Fée Clochette",
    version: "Collectionneuse de flocons de neige",
    text: [
      {
        title: "Avalanche de joie",
        description:
          "Tant que vous avez 4 cartes ou plus en main, ce personnage gagne <Insaisissable>.",
      },
      {
        title: "Découverte époustouflante",
        description: "Tant que vous avez 7 cartes ou plus en main, ce personnage gagne +3 {L}.",
      },
    ],
  },
  it: {
    name: "Trilli",
    version: "Collezionista di Fiocchi di Neve",
    text: [
      {
        title: "Turbinio di Delizia",
        description:
          "Mentre hai 4 o più carte in mano, questo personaggio ottiene <Sfuggente>. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
      {
        title: "Ritrovamento Spettacolare",
        description: "Mentre hai 7 o più carte in mano, questo personaggio riceve +3 {L}.",
      },
    ],
  },
};
