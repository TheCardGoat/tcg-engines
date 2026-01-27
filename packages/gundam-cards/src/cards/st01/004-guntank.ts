import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guntank: UnitCardDefinition = {
  id: "st01-004",
  name: "Guntank",
  cardNumber: "ST01-004",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【Deploy】Choose 1 enemy Unit with 2 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-004.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["hayato-kobayashi"],
  effects: [
    {
      id: "st01-004-effect-1",
      description: "【Deploy】 Choose 1 enemy Unit with 2 or less HP. Rest it.",
      type: "TRIGGERED",
      timing: "DEPLOY",
      action: {
        type: "CUSTOM",
        text: "Choose 1 enemy Unit with 2 or less HP. Rest it.",
      },
    },
  ],
};
