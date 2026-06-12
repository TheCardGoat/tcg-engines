import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Dellinger067I18n } from "./067-dellinger.i18n.ts";

export const op14eb04Dellinger067: CharacterCard = {
  id: "OP14-067",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Donquixote Pirates"],
  attribute: "strike",
  effect:
    "[On K.O.] Add up to 1 DON!! card from your DON!! deck and rest it, look at 5 cards from the top of your deck; reveal up to 1 {Donquixote Pirates} type card and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
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
                value: "Donquixote Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op14eb04Dellinger067I18n,
};
