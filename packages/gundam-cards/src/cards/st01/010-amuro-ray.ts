import type { PilotCardDefinition } from "@tcg/gundam-types";

export const AmuroRay: PilotCardDefinition = {
  id: "st01-010",
  name: "Amuro Ray",
  cardNumber: "ST01-010",
  setCode: "ST01",
  cardType: "PILOT",
  rarity: "common",
  color: "blue",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  traits: ["earth", "federation", "white", "base", "team", "newtype"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "eff-7s3jt8kt0",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Add this card to your hand.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
    {
      id: "eff-b8x49uslj",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description: "Choose 1 enemy Unit with 5 or less HP. Rest it.",
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
              value: 5,
            },
          ],
        },
      },
    },
  ],
};
