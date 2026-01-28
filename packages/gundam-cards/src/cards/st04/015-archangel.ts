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
      id: "eff-pranzu34m",
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
      id: "eff-9wgipj49x",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description: "Add 1 of your Shields to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-cw8s0g7h1",
      type: "ACTIVATED",
      timing: "MAIN",
      description:
        "【Once per Turn】②:Choose 1 friendly Unit with . Set it as active. It can't attack during this turn.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [
        {
          type: "ENERGY",
          amount: 2,
        },
      ],
      conditions: [],
      action: {
        type: "STAND",
        target: {
          controller: "SELF",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
};
