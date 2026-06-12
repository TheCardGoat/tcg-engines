import type { CharacterCard } from "@tcg/op-types";
import { op05CaptainMckinley112I18n } from "./112-captain-mckinley.i18n.ts";

export const op05CaptainMckinley112: CharacterCard = {
  id: "OP05-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  power: 3000,
  counter: 1000,
  traits: ["Sky Island"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On K.O.] Play up to 1 [Sky Island] type Character card with a cost of 1 from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
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
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "trait",
                value: "Sky Island",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op05CaptainMckinley112I18n,
};
