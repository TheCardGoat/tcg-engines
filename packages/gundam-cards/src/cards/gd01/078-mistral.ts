import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Mistral: UnitCardDefinition = {
  id: "gd01-078",
  name: "Mistral",
  cardNumber: "GD01-078",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 1,
  cost: 1,
  text: "【Deploy】Choose 1 enemy Unit. It gets AP-1 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-078.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 1,
  hp: 1,
  zones: ["space"],
  traits: ["earth", "alliance"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-mudmjvnhu",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description: "Choose 1 enemy Unit. It gets AP-1 during this turn.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "AP",
        value: -1,
        duration: "TURN",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
  ],
};
