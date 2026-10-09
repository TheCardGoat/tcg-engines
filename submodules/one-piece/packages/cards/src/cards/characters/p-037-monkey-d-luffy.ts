import type { CharacterCard } from "@tcg/op-types";
import { pMonkeyDLuffy037I18n } from "./p-037-monkey-d-luffy.i18n.ts";
export const pMonkeyDLuffy037: CharacterCard = {
  id: "P-037",
  canonicalId: "P-037",
  slug: "monkey-d-luffy/p-037",
  name: "Monkey.D.Luffy",
  printings: [
    {
      id: "P-037",
      artId: "P-037",
      setCode: "P",
      collectorNumber: "037",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-037.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 4000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[When Attacking] If you have 2 or more rested Characters, this Character gains +1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
        actions: [
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
        ],
      },
    ],
  },
  i18n: pMonkeyDLuffy037I18n,
};
