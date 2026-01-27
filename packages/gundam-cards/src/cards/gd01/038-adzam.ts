import type { UnitCardDefinition } from "@tcg/gundam-types";

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
  effects: [
    {
      id: "gd01-038-effect-1",
      description:
        "【Deploy】 If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unit",
            controller: "opponent",
            filter: {
              zone: "battle-area",
            },
          },
          amount: 1,
        },
      },
    },
  ],
};
