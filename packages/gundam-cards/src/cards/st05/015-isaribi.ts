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
      id: "eff-305jk287s",
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
      id: "eff-4oxqn98sw",
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
      id: "eff-gn52r826g",
      type: "ACTIVATED",
      timing: "MAIN",
      description:
        "Rest this Base:Choose 1 of your damaged Units. It gets AP+2 during this turn.",
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
        value: 2,
        duration: "TURN",
        target: {
          controller: "SELF",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "damaged",
            },
          ],
        },
      },
    },
  ],
};
