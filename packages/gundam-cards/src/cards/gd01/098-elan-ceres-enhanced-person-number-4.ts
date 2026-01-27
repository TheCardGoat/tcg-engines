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
      id: "gd01-098-effect-1",
      description: "【Burst】 Add this card to your hand.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Add this card to your hand.",
      },
    },
    {
      id: "gd01-098-effect-2",
      description:
        "【Activate･Action】 【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.",
      type: "ACTIVATED",
      timing: "ACTION",
      action: {
        type: "HEAL",
        parameters: {
          target: {
            type: "self",
          },
          amount: 1,
        },
      },
    },
  ],
};
