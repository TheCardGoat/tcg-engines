import type { CommandCardDefinition } from "@tcg/gundam-types";

export const KaisResolve: CommandCardDefinition = {
  id: "st01-013",
  name: "Kai's Resolve",
  cardNumber: "ST01-013",
  setCode: "ST01",
  cardType: "COMMAND",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 1,
  text: "【Main】Choose 1 friendly Unit. It recovers 3 HP.\n【Pilot】[Kai Shiden]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  pilotProperties: {
    name: "Kai Shiden",
    traits: ["earth", "federation", "white", "base", "team"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-h50noeevf",
      type: "CONSTANT",
      description:
        "Choose 1 friendly Unit. It recovers 3 HP. 【Pilot】[Kai Shiden]",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "HEAL",
            amount: 3,
            target: {
              controller: "SELF",
              cardType: "UNIT",
              count: {
                min: 1,
                max: 1,
              },
              filters: [],
            },
          },
          {
            type: "CUSTOM",
            text: "【Pilot】[Kai Shiden]",
          },
        ],
      },
    },
  ],
};
