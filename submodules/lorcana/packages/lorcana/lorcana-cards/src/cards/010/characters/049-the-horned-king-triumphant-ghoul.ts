import type { CharacterCard } from "@tcg/lorcana-types";
import { theHornedKingTriumphantGhoulI18n } from "./049-the-horned-king-triumphant-ghoul.i18n";

export const theHornedKingTriumphantGhoul: CharacterCard = {
  id: "MWo",
  canonicalId: "ci_747",
  reprints: ["set10-049"],
  cardType: "character",
  name: "The Horned King",
  version: "Triumphant Ghoul",
  inkType: ["amethyst"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 49,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ffc221e006704b97a8b62c29180b33b2",
    tcgPlayer: 658323,
  },
  text: [
    {
      title: "GRAND MACHINATIONS",
      description:
        "During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "King", "Sorcerer"],
  abilities: [
    {
      id: "1f3-1",
      name: "GRAND MACHINATIONS",
      text: "GRAND MACHINATIONS During your turn, if 1 or more cards have left a player's discard this turn, this character gets +2 {L}.",
      type: "static",
      condition: {
        type: "and",
        conditions: [
          {
            type: "turn",
            whose: "your",
          },
          {
            type: "turn-metric",
            metric: "discard-cards-left",
            comparison: {
              operator: "gte",
              value: 1,
            },
          },
        ],
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: theHornedKingTriumphantGhoulI18n,
};
