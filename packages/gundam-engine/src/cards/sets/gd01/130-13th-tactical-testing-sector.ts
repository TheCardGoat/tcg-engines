import type { BaseCardDefinition_Structure } from "../../card-types";

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
      description: "【Deploy】 Add 1 of your Shields to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add 1 of your Shields to your hand.",
      },
    },
    {
      activated: {
        timing: "MAIN",
      },
      description:
        "【Activate･Main】 Rest this Base：If a friendly (Academy) Unit is in play, choose 1 enemy Unit. It gets AP-1 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -1,
        duration: "turn",
      },
    },
  ],
};
