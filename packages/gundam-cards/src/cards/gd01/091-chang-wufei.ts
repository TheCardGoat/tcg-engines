import type { PilotCardDefinition } from "@tcg/gundam-types";

export const ChangWufei: PilotCardDefinition = {
  id: "gd01-091",
  name: "Chang Wufei",
  cardNumber: "GD01-091",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "uncommon",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\nDuring your turn, while this Unit has <Breach>, it can&#039;t receive battle damage from enemy Units with 3 or less AP.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-091.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  traits: ["operation", "meteor"],
  apModifier: 2,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Add this card to your hand. During your turn, while this Unit has <Breach>, it can&#039;t receive battle damage from enemy Units with 3 or less AP.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Add this card to your hand. During your turn, while this Unit has <Breach>, it can&#039;t receive battle damage from enemy Units with 3 or less AP.",
      },
    },
  ],
};
