import type { EventCard } from "@tcg/op-types";
import { op10GumGumDragonFirePistolTwisterStar039I18n } from "./039-gum-gum-dragon-fire-pistol-twister-star.i18n.ts";

export const op10GumGumDragonFirePistolTwisterStar039: EventCard = {
  id: "OP10-039",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP10",
  cost: 3,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 5 or less.",
  traits: ["Straw Hat Crew Supernovas ODYSSEY"],
  effect:
    '[Main] If your Leader has the "ODYSSEY" type, look at 5 cards from the top of your deck; reveal up to 2 "ODYSSEY" type Character cards and add them to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "ODYSSEY",
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
              amount: 2,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "trait",
                value: "ODYSSEY",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op10GumGumDragonFirePistolTwisterStar039I18n,
};
