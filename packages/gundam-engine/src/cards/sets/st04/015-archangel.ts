import type { BaseCardDefinition_Structure } from "../../card-types";

export const Archangel: BaseCardDefinition_Structure = {
  id: "st04-015",
  name: "Archangel",
  cardNumber: "ST04-015",
  setCode: "ST04",
  cardType: "BASE",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 1,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.\n\n【Activate･Main】【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-015.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: Number.NaN,
  hp: 5,
  zones: ["space", "earth"],
  traits: ["earth", "alliance", "warship"],
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
        "【Activate･Main】 【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.",
      },
    },
  ],
};
