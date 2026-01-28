import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Rasid039sMaganac: UnitCardDefinition = {
  id: "gd01-043",
  name: "Rasid&#039;s Maganac",
  cardNumber: "GD01-043",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 2,
  text: "【Deploy】Choose 1 of your green Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-043.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["maganac", "corps"],
  linkRequirements: ["(maganac-corps)-trait"],
  effects: [
    {
      id: "eff-6bh1vz6hl",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description:
        "Choose 1 of your green Units. During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "During this turn, it may choose an active enemy Unit with 4 or less AP as its attack target.",
      },
    },
  ],
};
