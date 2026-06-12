import type { EventCard } from "@tcg/op-types";
import { prb02GammaKnifePirateFoil077I18n } from "./077-gamma-knife-pirate-foil.i18n.ts";

export const prb02GammaKnifePirateFoil077: EventCard = {
  id: "OP05-077",
  cardType: "event",
  color: ["purple"],
  rarity: "C",
  setId: "PRB02",
  cost: 2,
  traits: ["Heart Pirates"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-077_r1.jpg",
      imageId: "OP05-077_r1",
    },
  ],
  effect:
    "[Main] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 1 of your opponent's Characters -5000 power during this turn.[Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -5000,
            duration: "thisTurn",
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
  i18n: prb02GammaKnifePirateFoil077I18n,
};
