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
      id: "st01-013-effect-1",
      description:
        "【Main】Choose 1 friendly Unit. It recovers 3 HP. 【Pilot】[Kai Shiden]",
      type: "CONSTANT",
      action: {
        type: "HEAL",
        parameters: {
          target: {
            type: "self",
          },
          amount: 3,
        },
      },
    },
  ],
};
