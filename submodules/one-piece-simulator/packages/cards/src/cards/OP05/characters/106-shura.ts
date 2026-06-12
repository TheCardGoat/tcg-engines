import type { CharacterCard } from "@tcg/op-types";
import { op05Shura106I18n } from "./106-shura.i18n.ts";

export const op05Shura106: CharacterCard = {
  id: "OP05-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP05",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Sky Island Vassals"],
  attribute: "slash",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Sky Island] type card other than [Shura] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
            revealFilters: [
              {
                filter: "excludeName",
                value: "Shura",
              },
              {
                filter: "trait",
                value: "Sky Island",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op05Shura106I18n,
};
