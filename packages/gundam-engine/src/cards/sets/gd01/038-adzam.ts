import type { UnitCardDefinition } from "../../card-types";

export const Adzam: UnitCardDefinition = {
  id: "gd01-038",
  name: "Adzam",
  cardNumber: "GD01-038",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "green",
  level: 5,
  cost: 4,
  text: "【Deploy】If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-038.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 5,
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirements: ["(zeon)-trait"],
  abilities: [
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.",
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
