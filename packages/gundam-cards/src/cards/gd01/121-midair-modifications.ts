import type { CommandCardDefinition } from "@tcg/gundam-types";

export const MidairModifications: CommandCardDefinition = {
  id: "gd01-121",
  name: "Midair Modifications",
  cardNumber: "GD01-121",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "white",
  level: 3,
  cost: 2,
  text: "【Burst】Activate this card&#039;s 【Main】.\n【Main】Choose 1 rested Unit with <Blocker>. Set it as active. It can&#039;t attack during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-121.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Activate this card&#039;s 【Main】. 【Main】Choose 1 rested Unit with <Blocker>. Set it as active. It can&#039;t attack during this turn.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Activate this card&#039;s 【Main】. 【Main】Choose 1 rested Unit with <Blocker>. Set it as active. It can&#039;t attack during this turn.",
      },
    },
  ],
};
