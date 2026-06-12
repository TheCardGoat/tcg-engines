import type { CharacterCard } from "@tcg/op-types";
import { op08ScratchmenApoo087I18n } from "./087-scratchmen-apoo.i18n.ts";

export const op08ScratchmenApoo087: CharacterCard = {
  id: "OP08-087",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates On-Air Pirates"],
  attribute: "ranged",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [Activate:Main] [Once Per Turn] Give up to 1 of your opponent's Characters 1 cost during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 1,
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08ScratchmenApoo087I18n,
};
