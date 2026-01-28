import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gundam: UnitCardDefinition = {
  id: "gd01-001",
  name: "Gundam",
  cardNumber: "GD01-001",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "blue",
  level: 4,
  cost: 3,
  text: "All your (White Base Team) Units gain <Repair 1>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】If you have 2 or more other Units in play, draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["amuro-ray"],
  effects: [
    {
      id: "eff-pmx9jjii1",
      type: "CONSTANT",
      description:
        "All your (White Base Team) Units gain <Repair 1>. (At the end of your turn, this Unit recovers the specified number of HP.)",
      restrictions: [],
      conditions: [],
      action: {
        type: "HEAL",
        amount: 1,
        target: {
          controller: "SELF",
          cardType: "UNIT",
          filters: [],
        },
      },
    },
    {
      id: "eff-zl9lykfm9",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description: "If you have 2 or more other Units in play, draw 1.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [
          {
            type: "STATE_CHECK",
            text: "you have 2 or more other Units in play",
          },
        ],
        trueAction: {
          type: "DRAW",
          value: 1,
        },
      },
    },
  ],
};
