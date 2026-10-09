import type { CharacterCard } from "@tcg/op-types";
import { st09Shinobu007I18n } from "./st09-007-shinobu.i18n.ts";
export const st09Shinobu007: CharacterCard = {
  id: "ST09-007",
  canonicalId: "ST09-007",
  slug: "shinobu/st09-007",
  name: "Shinobu",
  printings: [
    {
      id: "ST09-007",
      artId: "ST09-007",
      setCode: "ST09",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-007.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 3,
  traits: ["Land of Wano"],
  power: 2000,
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Block] You may add 1 card from the top or bottom of your Life cards to your hand: This Character gains +4000 power during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onBlock",
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
            value: 4000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st09Shinobu007I18n,
};
