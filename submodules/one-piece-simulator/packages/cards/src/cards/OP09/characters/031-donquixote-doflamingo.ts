import type { CharacterCard } from "@tcg/op-types";
import { op09DonquixoteDoflamingo031I18n } from "./031-donquixote-doflamingo.i18n.ts";

export const op09DonquixoteDoflamingo031: CharacterCard = {
  id: "OP09-031",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea ODYSSEY"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[End of Your Turn] If you have 2 or more rested Characters, set this Character as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "state",
                value: "rested",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
      },
    ],
  },
  i18n: op09DonquixoteDoflamingo031I18n,
};
