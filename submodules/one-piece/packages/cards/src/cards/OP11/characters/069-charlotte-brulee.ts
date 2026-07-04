import type { CharacterCard } from "@tcg/op-types";
import { op11CharlotteBrulee069I18n } from "./069-charlotte-brulee.i18n.ts";

export const op11CharlotteBrulee069: CharacterCard = {
  id: "OP11-069",
  canonicalId: "OP11-069",
  slug: "charlotte-brulee/op11-069",
  name: "Charlotte Brulee",
  printings: [
    {
      id: "OP11-069",
      artId: "OP11-069",
      setCode: "OP11",
      collectorNumber: "069",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-069.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    '[On Play] You may add 1 card from the top of your Life cards to your hand: If your Leader has the "Big Mom Pirates" type, add up to 1 DON!! card from your DON!! deck and set it as active.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Big Mom Pirates",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op11CharlotteBrulee069I18n,
};
