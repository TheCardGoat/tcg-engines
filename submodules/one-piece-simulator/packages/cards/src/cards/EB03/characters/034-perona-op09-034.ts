import type { CharacterCard } from "@tcg/op-types";
import { eb03PeronaOp09034034I18n } from "./034-perona-op09-034.i18n.ts";

export const eb03PeronaOp09034034: CharacterCard = {
  id: "OP09-034",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB03",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Thriller Bark Pirates Muggy Kingdom"],
  attribute: "special",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Dracule Mihawk] or "Thriller Bark Pirates" type card and add it to your hand. Then, place the rest at the bottom of your deck in any order and trash 1 card from your hand.',
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
                value: "Dracule Mihawk",
              },
              {
                filter: "trait",
                value: "Thriller Bark Pirates",
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
  i18n: eb03PeronaOp09034034I18n,
};
