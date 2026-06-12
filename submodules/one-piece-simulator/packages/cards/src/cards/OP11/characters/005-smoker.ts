import type { CharacterCard } from "@tcg/op-types";
import { op11Smoker005I18n } from "./005-smoker.i18n.ts";

export const op11Smoker005: CharacterCard = {
  id: "OP11-005",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[DON!! x1] This Character cannot be K.O.'d by effects of Characters without the (Special) attribute.",
  effects: {
    keywords: ["blocker"],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            duration: "permanent",
            restriction: "byEffect",
            byFilter: [
              {
                filter: "attribute",
                value: "special",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op11Smoker005I18n,
};
