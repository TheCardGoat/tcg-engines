import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheWitchAndTheBride: CommandCardDefinition = {
  id: "gd01-117",
  name: "The Witch and the Bride",
  cardNumber: "GD01-117",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "white",
  level: 5,
  cost: 2,
  text: "【Burst】Activate this card&#039;s 【Main】.\n【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner&#039;s hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-117.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Activate this card&#039;s 【Main】. 【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner&#039;s hand.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Activate this card&#039;s 【Main】. 【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner&#039;s hand.",
      },
    },
  ],
};
