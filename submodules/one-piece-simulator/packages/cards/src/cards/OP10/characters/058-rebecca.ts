import type { CharacterCard } from "@tcg/op-types";
import { op10Rebecca058I18n } from "./058-rebecca.i18n.ts";

export const op10Rebecca058: CharacterCard = {
  id: "OP10-058",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "OP10",
  cost: 7,
  power: 4000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-058_p1.jpg",
      imageId: "OP10-058_p1",
    },
  ],
  effect:
    '[On Play] If there is a Character with a cost of 8 or more, draw 1 card. Then, reveal up to 2 "Dressrosa" type Character cards with a cost of 7 or less other than [Rebecca] from your hand. Play 1 of the revealed cards and play the other card rested if it has a cost of 4 or less.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 8,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op10Rebecca058I18n,
};
