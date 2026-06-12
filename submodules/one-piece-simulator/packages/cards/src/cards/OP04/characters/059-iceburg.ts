import type { CharacterCard } from "@tcg/op-types";
import { op04Iceburg059I18n } from "./059-iceburg.i18n.ts";

export const op04Iceburg059: CharacterCard = {
  id: "OP04-059",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP04",
  cost: 1,
  power: 0,
  counter: 1000,
  traits: ["Galley-La Company Water Seven"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, this Character gains [Blocker] during this turn. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Water Seven",
          },
        ],
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
            keyword: "blocker",
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op04Iceburg059I18n,
};
