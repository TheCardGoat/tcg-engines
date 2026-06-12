import type { CharacterCard } from "@tcg/op-types";
import { op04Franky063I18n } from "./063-franky.i18n.ts";

export const op04Franky063: CharacterCard = {
  id: "OP04-063",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP04",
  cost: 1,
  power: 1000,
  counter: 2000,
  traits: ["Water Seven The Franky Family"],
  attribute: "wisdom",
  effect:
    "[On Your Opponent's Attack] [Once Per Turn] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): If your Leader has the [Water Seven] type, up to 1 of your Leader or Character cards gains +1000 power during this battle.",
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
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04Franky063I18n,
};
