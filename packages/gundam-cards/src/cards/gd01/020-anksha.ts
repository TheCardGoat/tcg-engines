import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Anksha: UnitCardDefinition = {
  id: "gd01-020",
  name: "Anksha",
  cardNumber: "GD01-020",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 4,
  cost: 2,
  text: "【Deploy】Choose 1 rested enemy Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-020.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 3,
  zones: ["earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-fl1d2vadw",
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
