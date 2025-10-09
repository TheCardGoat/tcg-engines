import type { BaseCardDefinition_Structure } from "../../card-types";

export const Isaribi: BaseCardDefinition_Structure = {
  id: "st05-015",
  name: "Isaribi",
  cardNumber: "ST05-015",
  setCode: "ST05",
  cardType: "BASE",
  rarity: "common",
  level: 3,
  cost: 1,
  text: "【Burst】Deploy this card.
【Deploy】Add 1 of your Shields to your hand.<br />
【Activate･Main】Rest this Base：Choose 1 of your damaged Units. It gets AP+2 during this turn.
",
  imageUrl: "../images/cards/card/ST05-015.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: NaN,
  hp: 5,
  zones: [
    "space",
  ],
  traits: [
    "tekkadan",
    "warship",
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
      description: "【Activate･Main】 Rest this Base：Choose 1 of your damaged Units. It gets AP+2 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: 2,
        duration: "turn",
      },
    },
  ],
};
