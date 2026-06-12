import type { CharacterCard } from "@tcg/op-types";
import { op01Penguin050I18n } from "./050-penguin.i18n.ts";

export const op01Penguin050: CharacterCard = {
  id: "OP01-050",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] If you don't have [Shachi], play up to 1 [Shachi] from your hand.  This card has been officially errata'd.",
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
                value: "Shachi",
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
                value: "Shachi",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op01Penguin050I18n,
};
