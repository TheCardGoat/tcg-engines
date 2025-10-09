import type { PilotCardDefinition } from "../../card-types";

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
  text: "【Burst】Add this card to your hand.
【Activate･Action】【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.
",
  imageUrl: "../images/cards/card/GD01-098.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  traits: [
    "academy",
  ],
  apModifier: 2,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand.",
      },
    },
    {
      activated: {
        timing: "ACTION",
      },
      description: "【Activate･Action】 【Once per Turn】If an enemy Unit with 1 or less AP is in play, this Unit recovers 1 HP.",
      effect: {
        type: "RECOVER_HP",
        amount: 1,
        target: {
          type: "self",
        },
      },
    },
  ],
};
