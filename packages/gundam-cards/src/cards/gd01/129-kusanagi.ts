import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const Kusanagi: BaseCardDefinition_Structure = {
  id: "gd01-129",
  name: "Kusanagi",
  cardNumber: "GD01-129",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "uncommon",
  color: "white",
  level: 4,
  cost: 2,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Return it to its owner&#039;s hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-129.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: Number.NaN,
  hp: 4,
  zones: ["space"],
  traits: ["triple", "ship", "alliance", "warship"],
  effects: [
    {
      id: "gd01-129-effect-1",
      description: "【Burst】 Deploy this card.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Deploy this card.",
      },
    },
    {
      id: "gd01-129-effect-2",
      description:
        "【Deploy】 Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Return it to its owner&#039;s hand.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "CUSTOM",
        text: "Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Return it to its owner&#039;s hand.",
      },
    },
  ],
};
