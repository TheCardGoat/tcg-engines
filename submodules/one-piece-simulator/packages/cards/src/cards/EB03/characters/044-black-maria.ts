import type { CharacterCard } from "@tcg/op-types";
import { eb03BlackMaria044I18n } from "./044-black-maria.i18n.ts";

export const eb03BlackMaria044: CharacterCard = {
  id: "EB03-044",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "EB03",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  effect:
    "If your Leader is multicolored, this Character gains [Blocker]. [On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Onigashima Island] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Onigashima Island] from your hand.",
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
                filter: "name",
                value: "Onigashima Island",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "name",
                value: "Onigashima Island",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb03BlackMaria044I18n,
};
