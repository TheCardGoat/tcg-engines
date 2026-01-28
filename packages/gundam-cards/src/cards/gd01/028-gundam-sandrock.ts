import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamSandrock: UnitCardDefinition = {
  id: "gd01-028",
  name: "Gundam Sandrock",
  cardNumber: "GD01-028",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "green",
  level: 5,
  cost: 3,
  text: "【Deploy】You may deploy 1 (Maganac Corps) Unit card from your hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-028.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 4,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["quatre-raberba-winner"],
  effects: [
    {
      id: "eff-242ly3wx4",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description: "You may deploy 1 (Maganac Corps) Unit card from your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "You may deploy 1 (Maganac Corps) Unit card from your hand.",
      },
    },
  ],
};
