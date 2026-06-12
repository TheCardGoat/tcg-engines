import type { EventCard } from "@tcg/op-types";
import { prb02GumGumJumpRopePirateFoil079I18n } from "./079-gum-gum-jump-rope-pirate-foil.i18n.ts";

export const prb02GumGumJumpRopePirateFoil079: EventCard = {
  id: "OP09-079",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  traits: ["Straw Hat Crew The Four Emperors"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-079_r1.jpg",
      imageId: "OP09-079_r1",
    },
  ],
  effect:
    "[Main] DON!! 2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's Characters with a cost of 5 or less. Then, draw 1 card.[Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
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
                  value: 5,
                },
              ],
            },
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
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
  i18n: prb02GumGumJumpRopePirateFoil079I18n,
};
