import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamDeathscythe: UnitCardDefinition = {
  id: "gd01-025",
  name: "Gundam Deathscythe",
  cardNumber: "GD01-025",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "green",
  level: 6,
  cost: 4,
  text: "【When Paired･(Operation Meteor) Pilot】Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn.\n\n(While this Unit is attacking, it deals damage before the enemy Unit.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-025.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 5,
  hp: 4,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["duo-maxwell"],
  effects: [
    {
      id: "eff-a2r506423",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description:
        "Place 1 rested Resource. Then, this Unit gains <First Strike> during this turn. (While this Unit is attacking, it deals damage before the enemy Unit.)",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "Place 1 rested Resource",
          },
          {
            type: "GAIN_KEYWORDS",
            keywords: ["First Strike"],
            duration: "TURN",
          },
          {
            type: "CUSTOM",
            text: ")",
          },
        ],
      },
    },
  ],
};
