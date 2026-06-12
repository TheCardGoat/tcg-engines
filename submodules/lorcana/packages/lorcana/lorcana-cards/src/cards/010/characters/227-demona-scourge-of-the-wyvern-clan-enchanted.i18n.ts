import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const demonaScourgeOfTheWyvernClanEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Demona",
    version: "Scourge of the Wyvern Clan",
    text: [
      {
        title: "AD SAXUM COMMUTATE",
        description:
          "When you play this character, exert all opposing characters. Then, each player with fewer than 3 cards in their hand draws until they have 3.",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Demona",
    version: "Peinigerin des Wyvern-Clans",
    text: [
      {
        title: "AD SAXUM COMMUTATE",
        description:
          "Wenn du diesen Charakter ausspielst, erschöpfe alle gegnerischen Charaktere. Danach ziehen alle Mitspielenden (auch du), die weniger als 3 Karten auf der Hand haben, so viele Karten, bis sie 3 Karten auf der Hand haben.",
      },
      {
        title: "AM TAGE AUS STEIN",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Démona",
    version: "Fléau du Clan de Wyvern",
    text: [
      {
        title: "AD SAXUM COMMUTATE",
        description:
          "Lorsque vous jouez ce personnage, épuisez tous les personnages adverses. Ensuite, chaque joueur ayant moins de 3 cartes en main pioche jusqu'à en avoir 3.",
      },
      {
        title: "STATUE LE JOUR",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Demona",
    version: "Flagello del Clan Wyvern",
    text: [
      {
        title: "AD SAXUM COMMUTATE",
        description:
          "Quando giochi questo personaggio, impegna tutti i personaggi avversari. Poi, ogni giocatore con meno di 3 carte in mano pesca fino ad averne 3.",
      },
      {
        title: "STATUE DI GIORNO",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
