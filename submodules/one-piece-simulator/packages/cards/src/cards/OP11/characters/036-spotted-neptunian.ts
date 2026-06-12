import type { CharacterCard } from "@tcg/op-types";
import { op11SpottedNeptunian036I18n } from "./036-spotted-neptunian.i18n.ts";

export const op11SpottedNeptunian036: CharacterCard = {
  id: "OP11-036",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Neptunian"],
  attribute: "strike",
  effect:
    '[On Play] If your Leader is "Shirahoshi", look at 5 cards from the top of your deck; reveal up to 1 "Neptunian" type card or "Shirahoshi" and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Shirahoshi",
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
            revealFilters: [
              {
                filter: "trait",
                value: "Neptunian",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op11SpottedNeptunian036I18n,
};
