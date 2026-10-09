import type { LeaderCard } from "@tcg/op-types";
import { st06Sakazuki001I18n } from "./st06-001-sakazuki.i18n.ts";
export const st06Sakazuki001: LeaderCard = {
  id: "ST06-001",
  canonicalId: "ST06-001",
  slug: "sakazuki/st06-001",
  name: "Sakazuki",
  printings: [
    {
      id: "ST06-001",
      artId: "ST06-001",
      setCode: "ST06",
      collectorNumber: "001",
      rarity: "L",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST06-001.png",
    },
  ],
  cardType: "leader",
  color: ["black"],
  rarity: "L",
  setId: "ST06",
  life: 5,
  power: 5000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[Activate: Main] [Once Per Turn] ③ (You may rest the specified number of DON!! cards in your cost area.) You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 0.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "ko",
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
                  value: 0,
                  comparison: "eq",
                },
              ],
            },
          },
        ],
        costs: [
          {
            cost: "restDon",
            amount: 3,
          },
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st06Sakazuki001I18n,
};
