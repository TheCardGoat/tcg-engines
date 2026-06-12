import type { CharacterCard } from "@tcg/op-types";
import { eb01TonyTonyChopper006I18n } from "./006-tony-tony-chopper.i18n.ts";

export const eb01TonyTonyChopper006: CharacterCard = {
  id: "EB01-006",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB01",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-006_p1.jpg",
      imageId: "EB01-006_p1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-006_p2.jpg",
      imageId: "EB01-006_p2",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[DON!! x2][When Attacking] Give up to 1 of your opponent's Characters -3000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: eb01TonyTonyChopper006I18n,
};
