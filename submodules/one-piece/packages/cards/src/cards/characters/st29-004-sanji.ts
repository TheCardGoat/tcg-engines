import type { CharacterCard } from "@tcg/op-types";
import { st29Sanji004I18n } from "./st29-004-sanji.i18n.ts";
export const st29Sanji004: CharacterCard = {
  id: "ST29-004",
  canonicalId: "ST29-004",
  slug: "sanji/st29-004",
  name: "Sanji",
  printings: [
    {
      id: "ST29-004",
      artId: "ST29-004",
      setCode: "ST29",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-004.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "ST29",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Egghead", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 {Straw Hat Crew} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  trigger: "You may trash 1 card from your hand: Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 4,
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
                value: "Straw Hat Crew",
                match: "exact",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st29Sanji004I18n,
};
