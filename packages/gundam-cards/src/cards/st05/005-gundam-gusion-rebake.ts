import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamGusionRebake: UnitCardDefinition = {
  id: "st05-005",
  name: "Gundam Gusion Rebake",
  cardNumber: "ST05-005",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "common",
  level: 4,
  cost: 3,
  text: "【Destroyed】Choose 1 enemy Unit with 4 or less AP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 3,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["tekkadan", "gundam", "frame"],
  linkRequirements: ["akihiro-altland"],
  effects: [
    {
      id: "eff-4ak74yc1u",
      type: "TRIGGERED",
      timing: "DESTROYED",
      description: "Choose 1 enemy Unit with 4 or less AP. Rest it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "REST",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "ap",
              comparison: "lte",
              value: 4,
            },
          ],
        },
      },
    },
  ],
};
