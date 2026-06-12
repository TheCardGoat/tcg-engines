import type { CharacterCard } from "@tcg/op-types";
import { op01BlackMaria111I18n } from "./111-black-maria.i18n.ts";

export const op01BlackMaria111: CharacterCard = {
  id: "OP01-111",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Block] DON!! -1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): This Character gains +1000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
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
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op01BlackMaria111I18n,
};
