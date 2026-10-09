import type { CharacterCard } from "@tcg/op-types";
import { st32DraculeMihawk003I18n } from "./st32-003-dracule-mihawk.i18n.ts";
export const st32DraculeMihawk003: CharacterCard = {
  id: "ST32-003",
  canonicalId: "ST32-003",
  slug: "dracule-mihawk/st32-003",
  name: "Dracule Mihawk",
  printings: [
    {
      id: "ST32-003",
      artId: "ST32-003",
      setCode: "ST32",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST32-003.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST32",
  cost: 6,
  traits: ["Muggy Kingdom", "The Seven Warlords of the Sea"],
  power: 7000,
  attribute: "slash",
  effect:
    "[Your Turn] When this Character becomes rested, draw 1 card and trash 1 card from your hand. [On Play] If your Leader has the <Slash> attribute, play up to 1 Character card with a cost of 5 or less that is either [Perona] or has the <Slash> attribute from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenBecomesRested",
        eventFilter: {
          targetSelf: true,
        },
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderAttribute",
            attribute: "slash",
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
                filter: "cardCategory",
                value: "character",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 5,
              },
              {
                filter: "anyOf",
                filters: [
                  {
                    filter: "name",
                    value: "Perona",
                  },
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
    ],
  },
  i18n: st32DraculeMihawk003I18n,
};
