import type { BaseCardDefinition_Structure } from "@tcg/gundam-types";

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
  text: "【Burst】Deploy this card.\n【Deploy】Add 1 of your Shields to your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-126.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: Number.NaN,
  hp: 6,
  zones: ["earth"],
  traits: ["maganac", "corps", "stronghold"],
  effects: [
    {
      id: "eff-49fjd7u8l",
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
      id: "eff-rkbpq5370",
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
