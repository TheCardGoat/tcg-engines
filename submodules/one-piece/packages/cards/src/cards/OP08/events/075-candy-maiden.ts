import type { EventCard } from "@tcg/op-types";
import { op08CandyMaiden075I18n } from "./075-candy-maiden.i18n.ts";

export const op08CandyMaiden075: EventCard = {
  id: "OP08-075",
  canonicalId: "OP08-075",
  slug: "candy-maiden",
  name: "Candy Maiden",
  printings: [
    {
      id: "OP08-075",
      artId: "OP08-075",
      setCode: "OP08",
      collectorNumber: "075",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-075.jpg",
    },
  ],
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "OP08",
  cost: 1,
  traits: ["Big Mom Pirates"],
  effect:
    "[Main] DON!! −1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 2 or less. Then, turn all of your Life cards face-down. [Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
          {
            action: "turnLifeFaceDown",
            player: "self",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: op08CandyMaiden075I18n,
};
