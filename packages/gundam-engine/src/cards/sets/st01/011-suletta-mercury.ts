import type { PilotCardDefinition } from "../../card-types";

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
      trigger: "ON_ATTACK",
      description:
        "【Attack】 【Once per Turn】Choose 1 of your Resources. Set it as active.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "【Once per Turn】Choose 1 of your Resources. Set it as active.",
      },
    },
  ],
};
