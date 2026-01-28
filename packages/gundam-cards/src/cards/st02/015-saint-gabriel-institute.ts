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
  effects: [
    {
      id: "eff-hbzpx6wxh",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Deploy this card.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DEPLOY",
      },
    },
    {
      id: "eff-93fsxsuyw",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "ADD_TO_HAND",
          },
          {
            type: "CUSTOM",
            text: "Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom",
          },
        ],
      },
    },
  ],
};
