import type { CharacterCard } from "@tcg/op-types";
import { st07CharlotteDaifuku005I18n } from "./st07-005-charlotte-daifuku.i18n.ts";
export const st07CharlotteDaifuku005: CharacterCard = {
  id: "ST07-005",
  canonicalId: "ST07-005",
  slug: "charlotte-daifuku/st07-005",
  name: "Charlotte Daifuku",
  printings: [
    {
      id: "ST07-005",
      artId: "ST07-005",
      setCode: "ST07",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-005.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 4,
  traits: ["Big Mom Pirates"],
  power: 5000,
  attribute: "slash",
  counter: 1000,
  effect:
    "[DON!! x1] [When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
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
  i18n: st07CharlotteDaifuku005I18n,
};
