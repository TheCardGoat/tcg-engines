import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guntank: UnitCardDefinition = {
  id: "gd01-008",
  name: "Guntank",
  cardNumber: "GD01-008",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 2,
  cost: 1,
  text: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-008.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-eeq8eg062",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description: "Choose 1 rested enemy Unit. Deal 1 damage to it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 1,
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "exerted",
            },
          ],
        },
      },
    },
  ],
};
