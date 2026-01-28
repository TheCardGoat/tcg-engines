import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GskyEasy: UnitCardDefinition = {
  id: "gd01-014",
  name: "G-Sky Easy",
  cardNumber: "GD01-014",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【During Link】【Activate･Action】【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-014.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["(white-base-team)-trait"],
  effects: [
    {
      id: "eff-g3qqkc3oc",
      type: "ACTIVATED",
      timing: "ACTION",
      description: "【Once per Turn】Choose 1 Unit. It recovers 1 HP.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [],
      conditions: [],
      action: {
        type: "HEAL",
        amount: 1,
        target: {
          controller: "ANY",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
};
