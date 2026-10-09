import type { CharacterCard } from "@tcg/op-types";
import { st26TonyTonyChopper002I18n } from "./st26-002-tony-tony-chopper.i18n.ts";
export const st26TonyTonyChopper002: CharacterCard = {
  id: "ST26-002",
  canonicalId: "ST26-002",
  slug: "tony-tony-chopper/st26-002",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "ST26-002",
      artId: "ST26-002",
      setCode: "ST26",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST26-002.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST26",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal", "Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] DON!! −2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): Rest up to 1 of your opponent's DON!! cards or Characters with a cost of 1 or less.",
  effects: {
    keywords: ["blocker"],
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
            action: "rest",
            target: {
              player: "opponent",
              zones: ["costArea", "character"],
              count: {
                amount: 1,
                upTo: true,
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
  i18n: st26TonyTonyChopper002I18n,
};
