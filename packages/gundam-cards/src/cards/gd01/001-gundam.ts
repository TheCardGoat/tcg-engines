import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gundam_GD01_001: UnitCardDefinition = {
  id: "gd01-001",
  name: "Gundam",
  cardNumber: "GD01-001",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "blue",
  level: 4,
  cost: 3,
  text: "All your (White Base Team) Units gain <Repair 1>.\n\n(At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】If you have 2 or more other Units in play, draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["amuro-ray"],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  effects: [
    {
      id: "gd01-001-effect-1",
      description:
        "【When Paired】 If you have 2 or more other Units in play, draw 1.",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      action: {
        type: "CUSTOM",
        text: "If you have 2 or more other Units in play, draw 1.",
      },
    },
  ],
};
