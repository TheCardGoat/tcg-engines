import type { CharacterCard } from "@tcg/op-types";
import { op15Enel118I18n } from "./op15-118-enel.i18n.ts";

export const op15Enel118: CharacterCard = {
  id: "OP15-118",
  canonicalId: "OP15-118",
  slug: "enel/op15-118",
  name: "Enel",
  printings: [
    {
      id: "OP15-118",
      artId: "OP15-118",
      setCode: "OP15",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-118_GppZ8HC.jpg",
      label: "Enel (OP15-118)",
    },
    {
      id: "OP15-118_p1",
      artId: "OP15-118_p2",
      setCode: "OP15",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-118_p2.jpg",
      label: "Enel (OP15-118) (Manga)",
    },
    {
      id: "OP15-118_p2",
      artId: "OP15-118_p1",
      setCode: "OP15",
      collectorNumber: "118",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-118_p1_PvQXjBT.jpg",
      label: "Enel (OP15-118) (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SEC",
  setId: "OP15",
  cost: 6,
  power: 8000,
  traits: ["Sky Island"],
  attribute: "special",
  effect:
    "If you have 6 or less DON!! cards on your field, this Character cannot be removed from the field by your opponent's effects and gains +2000 power.\n[On Play] DON!! 1: Look at 5 cards from the top of your deck and add up to 1 card to your hand. Then, place the rest at the bottom of your deck in any order, and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "lte",
            value: 6,
          },
        ],
        actions: [
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["field"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            bySource: "opponentEffect",
          },
        ],
      },
    ],
  },
  i18n: op15Enel118I18n,
};
