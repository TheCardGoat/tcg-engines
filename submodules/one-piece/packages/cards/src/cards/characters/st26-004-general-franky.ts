import type { CharacterCard } from "@tcg/op-types";
import { st26GeneralFranky004I18n } from "./st26-004-general-franky.i18n.ts";
export const st26GeneralFranky004: CharacterCard = {
  id: "ST26-004",
  canonicalId: "ST26-004",
  slug: "general-franky/st26-004",
  name: "General Franky",
  printings: [
    {
      id: "ST26-004",
      artId: "ST26-004",
      setCode: "ST26",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST26-004.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST26",
  cost: 8,
  power: 10000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "[On Play] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Give up to 2 of your opponent's Characters −2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st26GeneralFranky004I18n,
};
