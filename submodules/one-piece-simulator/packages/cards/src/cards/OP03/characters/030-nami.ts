import type { CharacterCard } from "@tcg/op-types";
import { op03Nami030I18n } from "./030-nami.i18n.ts";

export const op03Nami030: CharacterCard = {
  id: "OP03-030",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP03",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Arlong Pirates East Blue"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 green [East Blue] type card other than [Nami] and add it to your hand. Then, place the rest at the bottom of your deck in any order. [Trigger] Play this card.",
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
                value: "Nami",
              },
              {
                filter: "color",
                value: "green",
              },
              {
                filter: "trait",
                value: "East Blue",
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
  i18n: op03Nami030I18n,
};
