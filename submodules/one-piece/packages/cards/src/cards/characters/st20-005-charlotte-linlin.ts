import type { CharacterCard } from "@tcg/op-types";
import { st20CharlotteLinlin005I18n } from "./st20-005-charlotte-linlin.i18n.ts";
export const st20CharlotteLinlin005: CharacterCard = {
  id: "ST20-005",
  canonicalId: "ST20-005",
  slug: "charlotte-linlin/st20-005",
  name: "Charlotte Linlin",
  printings: [
    {
      id: "ST20-005",
      artId: "ST20-005",
      setCode: "ST20",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST20-005.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST20",
  cost: 6,
  power: 7000,
  traits: ["The Four Emperors", "Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card from your hand: Your opponent chooses one: • Your opponent trashes 2 cards from their hand. • Trash 1 card from the top of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "choice",
            player: "opponent",
            options: [
              [
                {
                  action: "trashFromHand",
                  player: "opponent",
                  amount: 2,
                },
              ],
              [
                {
                  action: "removeFromLife",
                  player: "opponent",
                  count: {
                    amount: 1,
                  },
                  destination: "trash",
                },
              ],
            ],
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st20CharlotteLinlin005I18n,
};
