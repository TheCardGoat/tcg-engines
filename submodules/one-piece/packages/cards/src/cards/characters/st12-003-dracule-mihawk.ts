import type { CharacterCard } from "@tcg/op-types";
import { st12DraculeMihawk003I18n } from "./st12-003-dracule-mihawk.i18n.ts";
export const st12DraculeMihawk003: CharacterCard = {
  id: "ST12-003",
  canonicalId: "ST12-003",
  slug: "dracule-mihawk/st12-003",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "ST12-003",
      artId: "ST12-003",
      setCode: "ST12",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST12-003.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST12",
  cost: 3,
  traits: ["The Seven Warlords of the Sea", "Muggy Kingdom"],
  power: 4000,
  attribute: "slash",
  counter: 2000,
  effect:
    "[On Play] If you have 2 or less Characters, play up to 1 {Muggy Kingdom} type or <Slash> attribute Character card with a cost of 4 or less other than [Dracule Mihawk] from your hand rested.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "lte",
            value: 2,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "excludeName",
                value: "Dracule Mihawk",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "trait",
                    value: "Muggy Kingdom",
                    match: "exact",
                  },
                  {
                    filter: "attribute",
                    value: "slash",
                  },
                ],
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: st12DraculeMihawk003I18n,
};
