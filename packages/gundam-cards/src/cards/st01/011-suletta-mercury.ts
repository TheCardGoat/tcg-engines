import type { PilotCardDefinition } from "@tcg/gundam-types";

export const SulettaMercury: PilotCardDefinition = {
  id: "st01-011",
  name: "Suletta Mercury",
  cardNumber: "ST01-011",
  setCode: "ST01",
  cardType: "PILOT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Attack】【Once per Turn】Choose 1 of your Resources. Set it as active.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  traits: ["academy"],
  apModifier: 1,
  hpModifier: 2,
  effects: [
    {
      id: "st01-011-effect-1",
      description: "【Burst】 Add this card to your hand.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Add this card to your hand.",
      },
    },
    {
      id: "st01-011-effect-2",
      description:
        "【Attack】 【Once per Turn】Choose 1 of your Resources. Set it as active.",
      type: "TRIGGERED",
      timing: "ATTACK",
      action: {
        type: "CUSTOM",
        text: "【Once per Turn】Choose 1 of your Resources. Set it as active.",
      },
    },
  ],
};
