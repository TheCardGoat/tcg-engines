import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Marguerite113I18n } from "./113-marguerite.i18n.ts";

export const op14eb04Marguerite113: CharacterCard = {
  id: "OP14-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 3,
  power: 5000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["Amazon Lily"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Amazon Lily} or {Kuja Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order and trash 1 card from your hand.",
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
                filter: "trait",
                value: "Amazon Lily",
              },
              {
                filter: "trait",
                value: "Kuja Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op14eb04Marguerite113I18n,
};
