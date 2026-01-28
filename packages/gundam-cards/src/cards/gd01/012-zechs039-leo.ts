import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zechs039Leo: UnitCardDefinition = {
  id: "gd01-012",
  name: "Zechs&#039; Leo",
  cardNumber: "GD01-012",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["oz"],
  linkRequirements: ["(oz)-trait"],
  effects: [
    {
      id: "eff-x6anxf1o3",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description: "Choose 1 enemy Unit with 3 or less HP. Rest it.",
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
              value: 3,
            },
          ],
        },
      },
    },
  ],
};
