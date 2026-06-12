import type { CharacterCard } from "@tcg/op-types";
import { op04Mr4Babe071I18n } from "./071-mr-4-babe.i18n.ts";

export const op04Mr4Babe071: CharacterCard = {
  id: "OP04-071",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP04",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    "[On Your Opponent's Attack] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains [Blocker] and +1000 power during this battle. (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    effects: [
      {
        trigger: "onOpponentAttack",
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
            duration: "thisBattle",
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op04Mr4Babe071I18n,
};
