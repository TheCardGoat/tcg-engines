import type { CommandCardDefinition } from "../../card-types";

export const InterceptOrders: CommandCardDefinition = {
  id: "gd01-099",
  name: "Intercept Orders",
  cardNumber: "GD01-099",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "blue",
  level: 4,
  cost: 2,
  text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.\n【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-099.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Choose 1 enemy Unit with 5 or less HP. Rest it. 【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Choose 1 enemy Unit with 5 or less HP. Rest it. 【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
      },
    },
  ],
};
