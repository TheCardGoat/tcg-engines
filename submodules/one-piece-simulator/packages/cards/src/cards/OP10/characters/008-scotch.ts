import type { CharacterCard } from "@tcg/op-types";
import { op10Scotch008I18n } from "./008-scotch.i18n.ts";

export const op10Scotch008: CharacterCard = {
  id: "OP10-008",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP10",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Punk Hazard"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If you don't have [Rock], play up to 1 [Rock] from your hand.",
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
                value: "Rock",
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
                value: "Rock",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op10Scotch008I18n,
};
