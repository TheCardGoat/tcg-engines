import type { LeaderCard } from "@tcg/op-types";
import { eb02CharlottePudding058I18n } from "./058-charlotte-pudding.i18n.ts";

export const eb02CharlottePudding058: LeaderCard = {
  id: "OP08-058",
  cardType: "leader",
  color: ["purple", "yellow"],
  rarity: "L",
  setId: "EB02",
  power: 5000,
  life: 4,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[When Attacking] You may turn 2 cards from the top of your Life cards face-up: Add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 2,
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
        optional: true,
      },
    ],
  },
  i18n: eb02CharlottePudding058I18n,
};
