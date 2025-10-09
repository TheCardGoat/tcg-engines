import type { CommandCardDefinition } from "../../card-types";

export const SiegePloy: CommandCardDefinition = {
  id: "st02-014",
  name: "Siege Ploy",
  cardNumber: "ST02-014",
  setCode: "ST02",
  cardType: "COMMAND",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 1,
  text: "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-014.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  timing: "MAIN",
  abilities: [
    {
      trigger: "ON_BURST",
      description:
        "【Burst】 Activate this card's 【Main】. 【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Activate this card's 【Main】. 【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Rest it.",
      },
    },
  ],
};
