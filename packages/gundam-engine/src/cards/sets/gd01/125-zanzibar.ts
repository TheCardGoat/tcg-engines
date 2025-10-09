import type { BaseCardDefinition_Structure } from "../../card-types";

export const Zanzibar: BaseCardDefinition_Structure = {
  id: "gd01-125",
  name: "Zanzibar",
  cardNumber: "GD01-125",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "uncommon",
  color: "green",
  level: 4,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, you may deploy 1 (Zeon) Unit card that is Lv.4 or lower from your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-125.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: Number.NaN,
  hp: 5,
  zones: ["space", "earth"],
  traits: ["zeon", "warship"],
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
      description:
        "【Deploy】 Add 1 of your Shields to your hand. Then, if it is your turn, you may deploy 1 (Zeon) Unit card that is Lv.4 or lower from your hand.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "Add 1 of your Shields to your hand. Then, if it is your turn, you may deploy 1 (Zeon) Unit card that is Lv.4 or lower from your hand.",
      },
    },
  ],
};
