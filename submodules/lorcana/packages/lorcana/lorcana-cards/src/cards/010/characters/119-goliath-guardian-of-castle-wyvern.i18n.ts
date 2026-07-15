import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goliathGuardianOfCastleWyvernI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goliath",
    version: "Guardian of Castle Wyvern",
    text: [
      {
        title: "BE CAREFUL, ALL OF YOU",
        description:
          "Whenever one of your Gargoyle characters challenges another character, gain 1 lore.",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Goliath",
    version: "Wächter von Burg Wyvern",
    text: [
      {
        title: "Ich bitte euch, seid vorsichtig",
        description:
          "Jedes Mal, wenn einer deiner Gargoyles einen anderen Charakter herausfordert, sammelst du 1 Legende.",
      },
      {
        title: "Am Tage aus Stein",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Goliath",
    version: "Gardien du château de Wyvern",
    text: [
      {
        title: "Soyez prudents, tous",
        description:
          "Chaque fois que l'un de vos personnages Gargouille défie un autre personnage, gagnez 1 éclat de Lore.",
      },
      {
        title: "Statue le jour",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Golia",
    version: "Guardiano di Castello Wyvern",
    text: [
      {
        title: "State Attenti, Tutti Quanti",
        description:
          "Ogni volta che uno dei tuoi personaggi Gargoyle sfida un altro personaggio, ottieni 1 leggenda.",
      },
      {
        title: "Statue di Giorno",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
