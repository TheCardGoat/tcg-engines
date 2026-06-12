import type { CharacterCard } from "@tcg/op-types";
import { op01Shachi044I18n } from "./044-shachi.i18n.ts";

export const op01Shachi044: CharacterCard = {
  id: "OP01-044",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] If you don't have [Penguin], play up to 1 [Penguin] from your hand.  This card has been officially errata'd.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "notHasCard",
            player: "self",
            zone: "field",
            filters: [
              {
                filter: "name",
                value: "Penguin",
              },
            ],
          },
        ],
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
                filter: "name",
                value: "Penguin",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op01Shachi044I18n,
};
