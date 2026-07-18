import type { CharacterCard } from "@tcg/op-types";
import { op04KinEmon102I18n } from "./102-kin-emon.i18n.ts";

export const op04KinEmon102: CharacterCard = {
  id: "OP04-102",
  canonicalId: "OP04-102",
  slug: "kin-emon/op04-102",
  name: "Kin'emon",
  printings: [
    {
      id: "OP04-102",
      artId: "OP04-102",
      setCode: "OP04",
      collectorNumber: "102",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-102.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP04",
  cost: 6,
  power: 6000,
  traits: ["Land of Wano"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] (1) (You may rest the specified number of DON!! cards in your cost area.) You may add 1 card from the top or bottom of your Life cards to your hand: Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "setActive",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op04KinEmon102I18n,
};
