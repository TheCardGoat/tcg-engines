import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const Isaribi: BaseCardDefinition_Structure = {
  id: "st05-015",
  name: "Isaribi",
  cardNumber: "ST05-015",
  setCode: "ST05",
  cardType: "BASE",
  rarity: "common",
  level: 3,
  cost: 1,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：Choose 1 of your damaged Units. It gets AP+2 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-015.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: Number.NaN,
  hp: 5,
  zones: ["space"],
  traits: ["tekkadan", "warship"],
  effects: [
    {
      id: "st05-015-effect-1",
      description: "【Burst】 Deploy this card.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Deploy this card.",
      },
    },
    {
      id: "st05-015-effect-2",
      description: "【Deploy】 Add 1 of your Shields to your hand.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "CUSTOM",
        text: "Add 1 of your Shields to your hand.",
      },
    },
    {
      id: "st05-015-effect-3",
      description:
        "【Activate･Main】 Rest this Base：Choose 1 of your damaged Units. It gets AP+2 during this turn.",
      type: "ACTIVATED",
      timing: "MAIN",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: 2,
          duration: "turn",
        },
      },
    },
  ],
};
