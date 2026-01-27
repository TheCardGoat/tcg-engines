import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const ThirteenthTacticalTestingSector: BaseCardDefinition_Structure = {
  id: "gd01-130",
  name: "13th Tactical Testing Sector",
  cardNumber: "GD01-130",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 1,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit. It gets AP-1 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-130.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: Number.NaN,
  hp: 5,
  zones: ["space"],
  traits: ["academy", "stronghold"],
  effects: [
    {
      id: "gd01-130-effect-1",
      description: "【Burst】 Deploy this card.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Deploy this card.",
      },
    },
    {
      id: "gd01-130-effect-2",
      description: "【Deploy】 Add 1 of your Shields to your hand.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "CUSTOM",
        text: "Add 1 of your Shields to your hand.",
      },
    },
    {
      id: "gd01-130-effect-3",
      description:
        "【Activate･Main】 Rest this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit. It gets AP-1 during this turn.",
      type: "ACTIVATED",
      timing: "MAIN",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: -1,
          duration: "turn",
        },
      },
    },
  ],
};
