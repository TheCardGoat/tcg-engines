import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guncannon: UnitCardDefinition = {
  id: "gd01-004",
  name: "Guncannon",
  cardNumber: "GD01-004",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "blue",
  level: 3,
  cost: 2,
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】Choose 1 enemy Unit with 2 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-004.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["(white-base-team)-trait"],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  effects: [
    {
      id: "eff-0clozxe5o",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
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
