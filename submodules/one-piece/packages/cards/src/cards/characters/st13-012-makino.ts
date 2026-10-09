import type { CharacterCard } from "@tcg/op-types";
import { st13Makino012I18n } from "./st13-012-makino.i18n.ts";
export const st13Makino012: CharacterCard = {
  id: "ST13-012",
  canonicalId: "ST13-012",
  slug: "makino/st13-012",
  name: "Makino",
  printings: [
    {
      id: "ST13-012",
      artId: "ST13-012",
      setCode: "ST13",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-012.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST13",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Windmill Village"],
  attribute: "wisdom",
  effect:
    "[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Look at all of your Life cards and place them back in your Life area in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "rearrangeLife",
            player: "self",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st13Makino012I18n,
};
