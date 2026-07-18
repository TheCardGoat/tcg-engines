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
        title: "Dämmerung bis Morgengrauen",
        description:
          "Am Ende des Zuges jeder Person, falls diese mehr als 2 Karten auf der Hand hat, muss sie so lange Karten von der Hand auswählen und abwerfen, bis sie 2 Karten auf der Hand hat. Falls die Person weniger als 2 Karten auf der Hand hat, muss sie so lange Karten ziehen, bis sie 2 Karten auf der Hand hat.",
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
    version: "Meneur du clan",
    text: [
      {
        title: "Du crépuscule à l'aube",
        description:
          "À la fin du tour de chaque joueur, si ce joueur a plus de 2 cartes en main, il en défausse jusqu'à n'en avoir plus que 2. S'il a moins de 2 cartes en main, il pioche jusqu'à en avoir 2.",
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
    version: "Capoclan",
    text: [
      {
        title: "Dal Tramonto all'Alba",
        description:
          "Alla fine del turno di ogni giocatore, se questo ha più di 2 carte in mano, sceglie e scarta carte finché non ne ha 2. Se ha meno di 2 carte in mano, pesca finché non ne ha 2.",
      },
      {
        title: "Statue di Giorno",
        description: "Se hai 3 o più carte in mano, questo personaggio non si può preparare.",
      },
    ],
  },
  es: {
    name: "Goliat",
    version: "Líder del clan",
    text: [
      {
        title: "Anochecer hasta el amanecer",
        description:
          "Al final del turno de cada jugador, si tiene más de 2 cartas en la mano, elige y descarta cartas hasta tener 2. Si tiene menos de 2 cartas en la mano, roba hasta tener 2.",
      },
      {
        title: "PIEDRA DE DÍA",
        description: "Si tienes 3 o más cartas en tu mano, este personaje no puede prepararse.",
      },
    ],
  },
};
