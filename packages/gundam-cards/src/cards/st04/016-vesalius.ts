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
  effects: [
    {
      id: "eff-q1yvfh3hm",
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
      id: "eff-jgtpg1j3x",
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
      id: "eff-xlwgdizac",
      type: "ACTIVATED",
      timing: "MAIN",
      description:
        "Rest this Base:Choose 1 friendly Unit. It gets AP+1 during this turn.",
      restrictions: [],
      costs: [
        {
          type: "REST_SELF",
          amount: 1,
        },
      ],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "AP",
        value: 1,
        duration: "TURN",
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
};
