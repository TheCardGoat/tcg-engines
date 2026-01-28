import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

export const MiningAsteroidPalau: BaseCardDefinition_Structure = {
  id: "gd01-128",
  name: "Mining Asteroid Palau",
  cardNumber: "GD01-128",
  setCode: "GD01",
  cardType: "BASE",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 1,
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-128.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: Number.NaN,
  hp: 6,
  zones: ["space"],
  traits: ["neo", "zeon", "stronghold"],
  effects: [
    {
      id: "eff-2g2nkdgsu",
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
      id: "eff-ass02jlev",
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
  ],
};
