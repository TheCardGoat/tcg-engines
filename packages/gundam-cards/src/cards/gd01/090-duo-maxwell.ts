import type { PilotCardDefinition } from "@tcg/gundam-types";

export const DuoMaxwell: PilotCardDefinition = {
  id: "gd01-090",
  name: "Duo Maxwell",
  cardNumber: "GD01-090",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【During Link】This Unit&#039;s AP can&#039;t be reduced by enemy effects.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-090.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  traits: ["operation", "meteor"],
  apModifier: 1,
  hpModifier: 2,
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Add this card to your hand. 【During Link】This Unit&#039;s AP can&#039;t be reduced by enemy effects.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Add this card to your hand. 【During Link】This Unit&#039;s AP can&#039;t be reduced by enemy effects.",
      },
    },
  ],
};
