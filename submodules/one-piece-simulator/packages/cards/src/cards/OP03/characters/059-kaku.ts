import type { CharacterCard } from "@tcg/op-types";
import { op03Kaku059I18n } from "./059-kaku.i18n.ts";

export const op03Kaku059: CharacterCard = {
  id: "OP03-059",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP03",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "slash",
  effect:
    "[When Attacking] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains [Banish] during this battle. (When this card deals damage, the target card is trashed without activating its Trigger.)",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "banish",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op03Kaku059I18n,
};
