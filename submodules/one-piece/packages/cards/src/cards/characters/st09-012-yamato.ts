import type { CharacterCard } from "@tcg/op-types";
import { st09Yamato012I18n } from "./st09-012-yamato.i18n.ts";
export const st09Yamato012: CharacterCard = {
  id: "ST09-012",
  canonicalId: "ST09-012",
  slug: "yamato/st09-012",
  name: "Yamato",
  printings: [
    {
      id: "ST09-012",
      artId: "ST09-012",
      setCode: "ST09",
      collectorNumber: "012",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-012.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 3,
  traits: ["Land of Wano"],
  power: 3000,
  attribute: "strike",
  counter: 2000,
  effect:
    "[When Attacking] You may add 1 card from the top or bottom of your Life cards to your hand: This Character gains +2000 power until the start of your next turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
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
            value: 2000,
            duration: "untilStartOfNextTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st09Yamato012I18n,
};
