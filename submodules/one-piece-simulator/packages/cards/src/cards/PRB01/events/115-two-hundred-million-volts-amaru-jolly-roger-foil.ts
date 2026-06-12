import type { EventCard } from "@tcg/op-types";
import { prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115I18n } from "./115-two-hundred-million-volts-amaru-jolly-roger-foil.i18n.ts";

export const prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115: EventCard = {
  id: "OP05-115",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "PRB01",
  cost: 2,
  traits: ["Sky Island"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_p3.jpg",
      imageId: "OP05-115_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_r1.png",
      imageId: "OP05-115_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-115_p4.jpg",
      imageId: "OP05-115_p4",
    },
  ],
  effect:
    "[Main] Up to 1 of your Leader or Character cards gains +3000 power during this turn. Then, if you have 1 or less Life cards, rest up to 1 of your opponent's Characters with a cost of 4 or less.[Trigger] You may trash 2 cards from your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01TwoHundredMillionVoltsAmaruJollyRogerFoil115I18n,
};
