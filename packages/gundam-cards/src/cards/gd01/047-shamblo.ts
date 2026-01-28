import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Shamblo: UnitCardDefinition = {
  id: "gd01-047",
  name: "Shamblo",
  cardNumber: "GD01-047",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "red",
  level: 8,
  cost: 7,
  text: "【Attack】If 2 or more other rested friendly Units are in play, choose 1 enemy Unit. Deal 3 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-047.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 6,
  hp: 5,
  zones: ["earth"],
  traits: ["zeon"],
  linkRequirements: ["(newtype)-trait-/-(cyber-newtype)-trait"],
  effects: [
    {
      id: "eff-ahox62ekg",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "If 2 or more other rested friendly Units are in play, choose 1 enemy Unit. Deal 3 damage to it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CONDITIONAL",
            conditions: [
              {
                type: "STATE_CHECK",
                text: "2 or more other rested friendly Units are in play",
              },
            ],
            trueAction: {
              type: "CUSTOM",
              text: "choose 1 enemy Unit",
            },
          },
          {
            type: "DAMAGE",
            value: 3,
          },
        ],
      },
    },
  ],
};
