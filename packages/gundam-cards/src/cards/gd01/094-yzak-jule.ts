import type { PilotCardDefinition } from "@tcg/gundam-types";

export const YzakJule: PilotCardDefinition = {
  id: "gd01-094",
  name: "Yzak Jule",
  cardNumber: "GD01-094",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "uncommon",
  color: "red",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Once per Turn】 When an enemy Link Unit is destroyed with damage while this Unit is attacking, draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-094.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: ["zaft", "coordinator"],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Add this card to your hand. 【Once per Turn】 When an enemy Link Unit is destroyed with damage while this Unit is attacking, draw 1.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Add this card to your hand. 【Once per Turn】 When an enemy Link Unit is destroyed with damage while this Unit is attacking, draw 1.",
      },
    },
  ],
};
