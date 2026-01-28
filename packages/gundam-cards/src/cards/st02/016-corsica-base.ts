import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const CorsicaBase: BaseCardDefinition_Structure = {
  id: "st02-016",
  name: "Corsica Base",
  cardNumber: "ST02-016",
  setCode: "ST02",
  cardType: "BASE",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 3,
  text: '【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)･AP4･HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)･AP1･HP1) Unit tokens instead.',
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-016.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: Number.NaN,
  hp: 5,
  zones: ["earth"],
  traits: ["oz", "stronghold"],
  effects: [
    {
      id: "eff-plwa038w5",
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
      id: "eff-hy64fzeah",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        'Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 [Tallgeese]((OZ)･AP4･HP2) Unit token. If it is your turn and a card with "Corsica Base" in its card name is in your trash, deploy 2 [Leo]((OZ)･AP1･HP1) Unit tokens instead.',
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
            type: "MODIFY_STATS",
            attribute: "AP",
            value: 4,
            duration: "TURN",
          },
          {
            type: "CONDITIONAL",
            conditions: [],
            trueAction: {
              type: "DEPLOY",
            },
          },
        ],
      },
    },
  ],
};
