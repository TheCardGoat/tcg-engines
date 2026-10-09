import type { CharacterCard } from "@tcg/op-types";
import { st25CrocodileMihawk003I18n } from "./st25-003-crocodile-mihawk.i18n.ts";
export const st25CrocodileMihawk003: CharacterCard = {
  id: "ST25-003",
  canonicalId: "ST25-003",
  slug: "crocodile-mihawk/st25-003",
  name: "Crocodile & Mihawk",
  printings: [
    {
      id: "ST25-003",
      artId: "ST25-003",
      setCode: "ST25",
      collectorNumber: "003",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST25-003.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST25",
  cost: 8,
  power: 7000,
  traits: ["Cross Guild", "Former Baroque Works"],
  attribute: ["slash", "special"],
  effect:
    "[On Play] Draw 2 cards and trash 1 card from your hand. Then, play up to 1 {Cross Guild} type Character card with a cost of 4 or less from your hand. [Once Per Turn] If your {Cross Guild} type Character would be removed from the field by your opponent's effect, you may trash 1 card from your hand instead.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
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
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Cross Guild",
                match: "exact",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
    replacementEffects: [
      {
        replacedEvent: "removeFromField",
        target: {
          player: "self",
          zones: ["character"],
          count: {
            amount: 1,
          },
          filters: [
            {
              filter: "trait",
              value: "Cross Guild",
              match: "exact",
            },
          ],
        },
        source: "opponentEffect",
        replacementAction: {
          action: "trashFromHand",
          player: "self",
          amount: 1,
        },
        oncePerTurn: true,
      },
    ],
  },
  i18n: st25CrocodileMihawk003I18n,
};
