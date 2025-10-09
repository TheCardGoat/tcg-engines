import type { CommandCardDefinition } from "../../card-types";

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
  abilities: [
    {
      description:
        "【Main】Choose 1 friendly Unit. It recovers 3 HP. 【Pilot】[Kai Shiden]",
      effect: {
        type: "RECOVER_HP",
        amount: 3,
        target: {
          type: "self",
        },
      },
    },
  ],
};
