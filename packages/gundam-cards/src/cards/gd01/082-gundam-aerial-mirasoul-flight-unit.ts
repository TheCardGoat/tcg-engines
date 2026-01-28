import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamAerialMirasoulFlightUnit: UnitCardDefinition = {
  id: "gd01-082",
  name: "Gundam Aerial (Mirasoul Flight Unit)",
  cardNumber: "GD01-082",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "white",
  level: 4,
  cost: 3,
  text: "【During Pair】【Activate･Action】【Once per Turn】②：Choose 1 enemy Unit. It gets AP-1 during this battle.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-082.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["suletta-mercury"],
  effects: [
    {
      id: "eff-dusup1euk",
      type: "ACTIVATED",
      timing: "ACTION",
      description:
        "【Once per Turn】②:Choose 1 enemy Unit. It gets AP-1 during this battle.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [
        {
          type: "ENERGY",
          amount: 2,
        },
      ],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "AP",
        value: -1,
        duration: "TURN",
        target: {
          controller: "OPPONENT",
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
