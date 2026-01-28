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
      id: "eff-s1girkyo7",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "If 5 or more enemy Units are in play, deal 1 damage to all enemy Units.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [
          {
            type: "STATE_CHECK",
            text: "5 or more enemy Units are in play",
          },
        ],
        trueAction: {
          type: "DAMAGE",
          value: 1,
          target: {
            controller: "OPPONENT",
            cardType: "UNIT",
            filters: [],
          },
        },
      },
    },
  ],
};
