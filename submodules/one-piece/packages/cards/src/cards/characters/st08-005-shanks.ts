import type { CharacterCard } from "@tcg/op-types";
import { st08Shanks005I18n } from "./st08-005-shanks.i18n.ts";
export const st08Shanks005: CharacterCard = {
  id: "ST08-005",
  canonicalId: "ST08-005",
  slug: "shanks/st08-005",
  name: "Shanks",
  printings: [
    {
      id: "ST08-005",
      artId: "ST08-005",
      setCode: "ST08",
      collectorNumber: "005",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-005.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "ST08",
  traits: ["Red-Haired Pirates"],
  cost: 9,
  power: 10000,
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. all Characters with a cost of 1 or less.",
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
            action: "ko",
            target: {
              player: "any",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st08Shanks005I18n,
};
