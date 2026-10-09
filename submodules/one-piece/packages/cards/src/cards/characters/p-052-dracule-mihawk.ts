import type { CharacterCard } from "@tcg/op-types";
import { pDraculeMihawk052I18n } from "./p-052-dracule-mihawk.i18n.ts";
export const pDraculeMihawk052: CharacterCard = {
  id: "P-052",
  canonicalId: "P-052",
  slug: "dracule-mihawk/p-052",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "P-052",
      artId: "P-052",
      setCode: "P",
      collectorNumber: "052",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-052.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 6,
  traits: ["The Seven Warlords of the Sea"],
  power: 7000,
  counter: 1000,
  attribute: "slash",
  effect: "[DON!! x1] This Character cannot be K.O.'d in battle by <Slash> attribute cards.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "inBattle",
            byFilter: [
              {
                filter: "attribute",
                value: "slash",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: pDraculeMihawk052I18n,
};
