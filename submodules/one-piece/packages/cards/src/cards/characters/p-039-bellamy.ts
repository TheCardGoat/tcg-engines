import type { CharacterCard } from "@tcg/op-types";
import { pBellamy039I18n } from "./p-039-bellamy.i18n.ts";
export const pBellamy039: CharacterCard = {
  id: "P-039",
  canonicalId: "P-039",
  slug: "bellamy/p-039",
  name: "Bellamy",
  printings: [
    {
      id: "P-039",
      artId: "P-039",
      setCode: "P",
      collectorNumber: "039",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-039.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "P",
  setId: "P",
  cost: 5,
  power: 6000,
  traits: ["Bellamy Pirates"],
  attribute: "strike",
  effect:
    "[Banish] (When this card deals damage, the target card is trashed without activating its Trigger.) [DON!! x2] If you have 0 Life cards, this Character gains +2000 power.",
  effects: {
    keywords: ["banish"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "eq",
            value: 0,
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
            value: 2000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: pBellamy039I18n,
};
