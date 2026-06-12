import type { ItemCard } from "@tcg/lorcana-types";
import { basilsMagnifyingGlassI18n } from "./166-basils-magnifying-glass.i18n";

export const basilsMagnifyingGlass: ItemCard = {
  id: "Ssx",
  canonicalId: "ci_Ssx",
  reprints: ["set5-166"],
  cardType: "item",
  name: "Basil's Magnifying Glass",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "005",
  cardNumber: 166,
  rarity: "rare",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6e39ed3b74964c12a79afd63898cf58a",
    tcgPlayer: 560629,
  },
  text: [
    {
      title: "FIND WHAT'S HIDDEN",
      description:
        "{E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  abilities: [
    {
      id: "pnm-1",
      text: "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "FIND WHAT'S HIDDEN",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "scry",
        amount: 3,
        destinations: [
          {
            filter: {
              cardType: "item",
              type: "card-type",
            },
            max: 1,
            min: 0,
            zone: "hand",
          },
          {
            ordering: "player-choice",
            remainder: true,
            zone: "deck-bottom",
          },
        ],
        target: "CONTROLLER",
      },
    },
  ],
  i18n: basilsMagnifyingGlassI18n,
};
