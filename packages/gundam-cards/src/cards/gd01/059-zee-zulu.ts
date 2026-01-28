import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ZeeZulu: UnitCardDefinition = {
  id: "gd01-059",
  name: "Zee Zulu",
  cardNumber: "GD01-059",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-059.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 2,
  zones: ["earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-r6d3jsibg",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "If you are attacking the enemy player, this Unit gets AP+2 during this battle.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [
          {
            type: "STATE_CHECK",
            text: "you are attacking the enemy player",
          },
        ],
        trueAction: {
          type: "MODIFY_STATS",
          attribute: "AP",
          value: 2,
          duration: "TURN",
        },
      },
    },
  ],
};
