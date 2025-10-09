import type { UnitCardDefinition } from "../../card-types";

export const GundamHeavyarms: UnitCardDefinition = {
  id: "st02-003",
  name: "Gundam Heavyarms",
  cardNumber: "ST02-003",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 5,
  cost: 3,
  text: "【During Pair】During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-003.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 3,
  hp: 4,
  zones: [
    "earth",
  ],
  traits: [
    "operation",
    "meteor",
  ],
  linkRequirements: [
    "trowa-barton",
  ],
  abilities: [
    {
      trigger: "DURING_PAIR",
      description: "【During Pair】 During your turn, when this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units that are Lv.3 or lower.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unit",
          controller: "opponent",
          filter: {
            zone: "battle-area",
          },
        },
      },
    },
  ],
};
