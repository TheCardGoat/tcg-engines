import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

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
  effects: [
    {
      id: "st04-015-effect-1",
      description: "【Burst】 Deploy this card.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Deploy this card.",
      },
    },
    {
      id: "st04-015-effect-2",
      description: "【Deploy】 Add 1 of your Shields to your hand.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "CUSTOM",
        text: "Add 1 of your Shields to your hand.",
      },
    },
    {
      id: "st04-015-effect-3",
      description:
        "【Activate･Main】 【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.",
      type: "ACTIVATED",
      timing: "MAIN",
      action: {
        type: "CUSTOM",
        text: "【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.",
      },
    },
  ],
};
