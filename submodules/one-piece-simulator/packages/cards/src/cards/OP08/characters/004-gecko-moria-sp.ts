import type { CharacterCard } from "@tcg/op-types";
import { op08GeckoMoriaSp004I18n } from "./004-gecko-moria-sp.i18n.ts";

export const op08GeckoMoriaSp004: CharacterCard = {
  id: "ST03-004",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea Thriller Bark Pirates"],
  attribute: "special",
  effect:
    "[On Play] Add up to 1 [The Seven Warlords of the Sea] or [Thriller Bark Pirates] type Character with a cost of 4 or less other than [Gecko Moria] from your trash to your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "The Seven Warlords of the Sea",
                },
                {
                  filter: "trait",
                  value: "Thriller Bark Pirates",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08GeckoMoriaSp004I18n,
};
