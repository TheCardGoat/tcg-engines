import type { PilotCardDefinition } from "@tcg/gundam-types";

export const KiraYamato: PilotCardDefinition = {
  id: "st04-010",
  name: "Kira Yamato",
  cardNumber: "ST04-010",
  setCode: "ST04",
  cardType: "PILOT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: ["earth", "alliance", "coordinator"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "st04-010-effect-1",
      description: "【Burst】 Add this card to your hand.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Add this card to your hand.",
      },
    },
    {
      id: "st04-010-effect-2",
      description:
        "【Attack】 Choose 1 enemy Unit. It gets AP-2 during this battle.",
      type: "TRIGGERED",
      timing: "ATTACK",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: -2,
          duration: "turn",
        },
      },
    },
  ],
};
