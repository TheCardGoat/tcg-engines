import type { BaseCardDefinition_Structure } from "../../card-types";

export const Side7: BaseCardDefinition_Structure = {
  id: "gd01-124",
  name: "Side 7",
  cardNumber: "GD01-124",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "common",
  color: "blue",
  level: 1,
  cost: 1,
  text: "【Burst】Deploy this card.
【Deploy】Add 1 of your Shields to your hand.<br />
【Activate･Main】Rest this Base：Choose 1 friendly Unit. It recovers 1 HP.
",
  imageUrl: "../images/cards/card/GD01-124.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: NaN,
  hp: 4,
  zones: [
    "space",
  ],
  traits: [
    "earth",
    "federation",
    "stronghold",
  ],
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
      description: "【Deploy】 Add 1 of your Shields to your hand.<br />",
      effect: {
        type: "UNKNOWN",
        rawText: "Add 1 of your Shields to your hand.<br />",
      },
    },
    {
      activated: {
        timing: "MAIN",
      },
      description: "【Activate･Main】 Rest this Base：Choose 1 friendly Unit. It recovers 1 HP.",
      effect: {
        type: "RECOVER_HP",
        amount: 1,
        target: {
          type: "self",
        },
      },
    },
  ],
};
