import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goliathClanLeaderEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goliath",
    version: "Clan Leader",
    text: [
      {
        title: "DUSK TO DAWN",
        description:
          "At the end of each player's turn, if they have more than 2 cards in their hand, they choose and discard cards until they have 2. If they have fewer than 2 cards in their hand, they draw until they have 2.",
      },
      {
        title: "STONE BY DAY",
        description: "If you have 3 or more cards in your hand, this character can't ready.",
      },
    ],
  },
  de: {
    name: "Goliath",
    version: "Clananführer",
    text: [
      {
        title: "DÄMMERUNG BIS MORGENGRAUEN",
        description:
          "Am Ende des Zuges jeder Person, falls diese mehr als 2 Karten auf der Hand hat, muss sie so lange Karten von der Hand auswählen und abwerfen, bis sie 2 Karten auf der Hand hat. Falls die Person weniger als 2 Karten auf der Hand hat, muss sie so lange Karten ziehen, bis sie 2 Karten auf der Hand hat.",
      },
      {
        title: "AM TAGE AUS STEIN",
        description:
          "Solange du 3 oder mehr Karten auf der Hand hast, kann dieser Charakter nicht bereit gemacht werden.",
      },
    ],
  },
  fr: {
    name: "Goliath",
    version: "Meneur du clan",
    text: [
      {
        title: "DU CRÉPUSCULE À L'AUBE À",
        description:
          "la fin du tour de chaque joueur, si ce joueur a plus de 2 cartes en main, il en défausse jusqu'à n'en avoir plus que 2. S'il a moins de 2 cartes en main, il pioche jusqu'à en avoir 2.",
      },
      {
        title: "STATUE LE JOUR",
        description:
          "Ce personnage ne peut pas se redresser si vous avez 3 cartes ou plus en main.",
      },
    ],
  },
  it: {
    name: "Golia",
    version: "Capoclan",
    text: [
      {
        title: "DAL TRAMONTO ALL'ALBA",
        description:
          "Alla fine del turno di ogni giocatore, se questo ha più di 2 carte in mano, sceglie e scarta carte finché non ne ha 2. Se ha meno di 2 carte in mano, pesca finché non ne ha 2.",
      },
      {
        title: "STATUE DI GIORNO",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
};
