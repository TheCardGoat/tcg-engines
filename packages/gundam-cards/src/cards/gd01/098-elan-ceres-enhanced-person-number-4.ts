import type { PilotCardDefinition } from "@tcg/gundam-types";

export const ElanCeresEnhancedPersonNumber4: PilotCardDefinition = {
  id: "gd01-098",
  name: "Elan Ceres (Enhanced Person Number 4)",
  cardNumber: "GD01-098",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Activate･Action】【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-098.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  traits: ["academy"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "eff-luwr43r2t",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Add this card to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-g6wkthyz8",
      type: "ACTIVATED",
      timing: "ACTION",
      description:
        "【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [],
        trueAction: {
          type: "HEAL",
          amount: 1,
        },
      },
    },
  ],
};
