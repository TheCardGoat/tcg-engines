import type { CommandCardDefinition } from "@tcg/gundam-types";

export const MidairModifications: CommandCardDefinition = {
  id: "gd01-121",
  name: "Midair Modifications",
  cardNumber: "GD01-121",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "white",
  level: 3,
  cost: 2,
  text: "【Burst】Activate this card&#039;s 【Main】.\n【Main】Choose 1 rested Unit with <Blocker>. Set it as active. It can&#039;t attack during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-121.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  effects: [
    {
      id: "eff-1v427ry5z",
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
      id: "eff-b4t0011lq",
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
      id: "eff-sua8s9n4c",
      type: "CONSTANT",
      description:
        "Choose 1 rested Unit with . Set it as active. It can&#039;t attack during this turn.",
      restrictions: [],
      conditions: [],
      action: {
        type: "STAND",
        target: {
          controller: "ANY",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "exerted",
            },
          ],
        },
      },
    },
  ],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
};
