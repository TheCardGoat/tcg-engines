import type { CharacterCard } from "@tcg/op-types";
import { op04Queen046I18n } from "./046-queen.i18n.ts";

export const op04Queen046: CharacterCard = {
  id: "OP04-046",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[On Play] If your Leader has the [Animal Kingdom Pirates] type, look at 7 cards from the top of your deck; reveal a total of 2 [Plague Rounds] or [Ice Oni] cards and add them to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Animal Kingdom Pirates",
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 7,
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
                filter: "name",
                value: "Plague Rounds",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op04Queen046I18n,
};
