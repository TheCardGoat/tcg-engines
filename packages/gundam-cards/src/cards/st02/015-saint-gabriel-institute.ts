import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const SaintGabrielInstitute: BaseCardDefinition_Structure = {
  id: "st02-015",
  name: "Saint Gabriel Institute",
  cardNumber: "ST02-015",
  setCode: "ST02",
  cardType: "BASE",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-015.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: Number.NaN,
  hp: 5,
  zones: ["earth"],
  traits: ["academy", "stronghold"],
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Deploy this card.",
      effect: {
        type: "UNKNOWN",
        rawText: "Deploy this card.",
      },
    },
    {
      trigger: "ON_DEPLOY",
      description:
        "【Deploy】 Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.",
      },
    },
  ],
};
