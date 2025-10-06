import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { atTheEndOfOpponentTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";

export const princeJohnsMirror: LorcanaItemCardDefinition = {
  id: "l9o",
  name: "Prince John's Mirror",
  characteristics: ["item"],
  text: "**YOU LOOK REGAL** If you have a character named Prince John in play, you pay 1 {I} less to play this item. **A FEELING OF POWER** At the end of each opponent’s turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
  type: "item",
  abilities: [
    whenYouPlayThisForEachYouPayLess({
      name: "You Look Regal",
      text: "If you have a character named Prince John in play, you pay 1 {I} less to play this item.",
      amount: 1,
      conditions: [
        {
          type: "filter",
          comparison: {
            operator: "gte",
            value: 1,
          },
          filters: [
            {
              filter: "attribute",
              value: "name",
              comparison: { operator: "eq", value: "Prince John" },
            },
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        },
      ],
    }),
    atTheEndOfOpponentTurn({
      name: "A Feeling Of Power",
      text: "At the end of each opponent’s turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
      responder: "opponent",
      conditions: [
        {
          type: "filter",
          comparison: { operator: "gt", value: 3 },
          filters: [
            { filter: "zone", value: "hand" },
            { filter: "owner", value: "opponent" },
          ],
        },
      ],
      effects: [
        {
          type: "discard",
          // TODO: We should remove amount from here
          amount: {
            dynamic: true,
            difference: 3,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "opponent" },
            ],
          },
          target: {
            type: "card",
            value: {
              dynamic: true,
              difference: 3,
              filters: [
                { filter: "zone", value: "hand" },
                { filter: "owner", value: "opponent" },
              ],
            },
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Stefano Zanchi",
  number: 98,
  set: "SSK",
  rarity: "rare",
};
