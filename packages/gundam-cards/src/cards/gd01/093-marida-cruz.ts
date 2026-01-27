import type { PilotCardDefinition } from "@tcg/gundam-types";

export const MaridaCruz: PilotCardDefinition = {
  id: "gd01-093",
  name: "Marida Cruz",
  cardNumber: "GD01-093",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "red",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【During Link】【Attack】Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-093.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: ["neo", "zeon", "cyber-newtype"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "gd01-093-effect-1",
      description: "【Burst】 Add this card to your hand. 【During Link】",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Add this card to your hand. 【During Link】",
      },
    },
    {
      id: "gd01-093-effect-2",
      description:
        "【Attack】 Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.",
      type: "TRIGGERED",
      timing: "ATTACK",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unknown",
            rawText: "it",
          },
          amount: 1,
        },
      },
    },
  ],
};
