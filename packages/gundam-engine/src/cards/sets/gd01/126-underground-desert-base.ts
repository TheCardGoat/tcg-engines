import type { BaseCardDefinition_Structure } from "../../card-types";

export const UndergroundDesertBase: BaseCardDefinition_Structure = {
  id: "gd01-126",
  name: "Underground Desert Base",
  cardNumber: "GD01-126",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 1,
  text: "【Burst】Deploy this card.
【Deploy】Add 1 of your Shields to your hand.
",
  imageUrl: "../images/cards/card/GD01-126.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: NaN,
  hp: 6,
  zones: [
    "earth",
  ],
  traits: [
    "maganac",
    "corps",
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
      description: "【Deploy】 Add 1 of your Shields to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add 1 of your Shields to your hand.",
      },
    },
  ],
};
