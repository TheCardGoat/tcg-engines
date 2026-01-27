import type { CommandCardDefinition } from "@tcg/gundam-types";

export const SecuringTheSupplyLine: CommandCardDefinition = {
  id: "gd01-102",
  name: "Securing the Supply Line",
  cardNumber: "GD01-102",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "blue",
  level: 4,
  cost: 2,
  text: "【Main】All friendly Units that are Lv.4 or lower recover 2 HP.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-102.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
  abilities: [
    {
      description:
        "【Main】All friendly Units that are Lv.4 or lower recover 2 HP.",
      effect: {
        type: "RECOVER_HP",
        amount: 2,
        target: {
          type: "self",
        },
      },
    },
  ],
};
