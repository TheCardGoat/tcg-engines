import type { LeaderCard } from "@tcg/op-types";
import { pSakazuki076I18n } from "./p-076-sakazuki.i18n.ts";
export const pSakazuki076: LeaderCard = {
  id: "P-076",
  canonicalId: "P-076",
  slug: "sakazuki/p-076",
  name: "Sakazuki",
  printings: [
    {
      id: "P-076",
      artId: "P-076",
      setCode: "P",
      collectorNumber: "076",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-076.png",
    },
  ],
  cardType: "leader",
  color: ["blue", "black"],
  rarity: "P",
  setId: "P",
  life: 4,
  traits: ["Navy"],
  power: 5000,
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] You may trash 1 {Navy} type card from your hand: Give up to 1 of your opponent's Characters －1 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        oncePerTurn: true,
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Navy",
              },
            ],
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: pSakazuki076I18n,
};
