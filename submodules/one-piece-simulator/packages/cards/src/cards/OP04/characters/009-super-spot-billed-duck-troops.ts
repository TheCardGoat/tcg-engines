import type { CharacterCard } from "@tcg/op-types";
import { op04SuperSpotBilledDuckTroops009I18n } from "./009-super-spot-billed-duck-troops.i18n.ts";

export const op04SuperSpotBilledDuckTroops009: CharacterCard = {
  id: "OP04-009",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP04",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Animal Alabasta"],
  attribute: "strike",
  effect:
    "[When Attacking] You may give your 1 active Leader -5000 power during this turn: Return this Character to the owner's hand at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "returnToHand",
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
        optional: true,
      },
    ],
  },
  i18n: op04SuperSpotBilledDuckTroops009I18n,
};
