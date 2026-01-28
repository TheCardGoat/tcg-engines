import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const Falmel: BaseCardDefinition_Structure = {
  id: "st03-016",
  name: "Falmel",
  cardNumber: "ST03-016",
  setCode: "ST03",
  cardType: "BASE",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 rested [Char's Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-016.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: Number.NaN,
  hp: 5,
  zones: ["space"],
  traits: ["zeon", "warship"],
  effects: [
    {
      id: "eff-i1srfp42h",
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
      id: "eff-dpk4vo5ei",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Add 1 of your Shields to your hand. Then, if it is your turn, deploy 1 rested [Char's Zaku Ⅱ]((Zeon)･AP3･HP1) Unit token.",
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
            value: 3,
            duration: "TURN",
          },
        ],
      },
    },
  ],
};
