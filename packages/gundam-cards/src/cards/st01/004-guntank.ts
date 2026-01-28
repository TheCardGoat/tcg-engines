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
      id: "eff-11qchr3sg",
      type: "TRIGGERED",
      timing: "DEPLOY",
      description: "Choose 1 enemy Unit with 2 or less HP. Rest it.",
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
              type: "hp",
              comparison: "lte",
              value: 2,
            },
          ],
        },
      },
    },
  ],
};
