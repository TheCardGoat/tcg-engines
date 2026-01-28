import type { CommandCardDefinition } from "@tcg/gundam-types";

export const TheWitchAndTheBride: CommandCardDefinition = {
  id: "gd01-117",
  name: "The Witch and the Bride",
  cardNumber: "GD01-117",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "white",
  level: 5,
  cost: 2,
  text: "【Burst】Activate this card&#039;s 【Main】.\n【Main】/【Action】Choose 1 enemy Unit with 5 or less HP. Return it to its owner&#039;s hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-117.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  timing: "MAIN",
  effects: [
    {
      id: "eff-diiswsfua",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Activate this card&#039;s",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Activate this card&#039;s",
      },
    },
    {
      id: "eff-3nvstkalu",
      type: "CONSTANT",
      description: ".",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: ".",
      },
    },
    {
      id: "eff-x805nyi7g",
      type: "CONSTANT",
      description: "/",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "/",
      },
    },
    {
      id: "eff-46k3ahhqq",
      type: "CONSTANT",
      description:
        "Choose 1 enemy Unit with 5 or less HP. Return it to its owner&#039;s hand.",
      restrictions: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
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
