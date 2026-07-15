import type { CharacterCard } from "@tcg/op-types";
import { op10DonquixoteRosinante072I18n } from "./072-donquixote-rosinante.i18n.ts";

export const op10DonquixoteRosinante072: CharacterCard = {
  id: "OP10-072",
  canonicalId: "OP10-072",
  slug: "donquixote-rosinante/op10-072",
  name: "Donquixote Rosinante",
  printings: [
    {
      id: "OP10-072",
      artId: "OP10-072",
      setCode: "OP10",
      collectorNumber: "072",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-072.jpg",
    },
    {
      id: "OP10-072_p1",
      artId: "OP10-072_p1",
      setCode: "OP10",
      collectorNumber: "072",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-072_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP10",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-072_p1.jpg",
      imageId: "OP10-072_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 Event from your hand: Draw 2 cards.\n[End of Your Turn] If you have 7 or more DON!! cards on your field, set up to 2 of your DON!! cards as active.",
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
        ],
        optional: true,
      },
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 7,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 2,
                upTo: true,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op10DonquixoteRosinante072I18n,
};
