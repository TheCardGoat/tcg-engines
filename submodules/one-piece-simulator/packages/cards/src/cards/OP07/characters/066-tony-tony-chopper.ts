import type { CharacterCard } from "@tcg/op-types";
import { op07TonyTonyChopper066I18n } from "./066-tony-tony-chopper.i18n.ts";

export const op07TonyTonyChopper066: CharacterCard = {
  id: "OP07-066",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP07",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Animal Foxy Pirates"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op07TonyTonyChopper066I18n,
};
