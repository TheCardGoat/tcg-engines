import type { CharacterCard } from "@tcg/op-types";
import { pHodyHyouzou062I18n } from "./p-062-hody-hyouzou.i18n.ts";
export const pHodyHyouzou062: CharacterCard = {
  id: "P-062",
  canonicalId: "P-062",
  slug: "hody-hyouzou/p-062",
  name: "Hody & Hyouzou",
  printings: [
    {
      id: "P-062",
      artId: "P-062",
      setCode: "P",
      collectorNumber: "062",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-062.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 4,
  traits: ["Fish-Man", "Merfolk", "New Fish-Man Pirates"],
  power: 6000,
  attribute: ["slash", "strike"],
  effect:
    "[Activate: Main] [Once Per Turn] Rest up to 1 of your opponent's Characters with a cost of 4 or less and this Character gains +1000 power during this turn. Then, add 1 card from the top of your Life cards to your hand.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
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
                  value: 4,
                },
              ],
            },
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "removeFromLife",
            player: "self",
            count: {
              amount: 1,
            },
            destination: "hand",
            position: "top",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: pHodyHyouzou062I18n,
};
