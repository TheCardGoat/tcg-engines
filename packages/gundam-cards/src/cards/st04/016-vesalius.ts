import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const Vesalius: BaseCardDefinition_Structure = {
  id: "st04-016",
  name: "Vesalius",
  cardNumber: "ST04-016",
  setCode: "ST04",
  cardType: "BASE",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 1,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】Rest this Base：Choose 1 friendly Unit. It gets AP+1 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-016.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: Number.NaN,
  hp: 5,
  zones: ["space"],
  traits: ["zaft", "warship"],
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
        "【Activate･Main】 Rest this Base：Choose 1 friendly Unit. It gets AP+1 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 1,
        duration: "turn",
      },
    },
  ],
};
