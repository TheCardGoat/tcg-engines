import type { CommandCardDefinition } from "@tcg/gundam-types";

export const FatalStrike: CommandCardDefinition = {
  id: "st05-014",
  name: "Fatal Strike",
  cardNumber: "ST05-014",
  setCode: "ST05",
  cardType: "COMMAND",
  rarity: "common",
  level: 4,
  cost: 2,
  text: "【Burst】Choose 1 enemy Unit. Deal 1 damage to it.\n【Main】Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-014.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  timing: "MAIN",
  effects: [
    {
      id: "eff-unrieu6nx",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Choose 1 enemy Unit. Deal 1 damage to it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 1,
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [],
        },
      },
    },
    {
      id: "eff-hx9qajvhi",
      type: "CONSTANT",
      description: "Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "3 or lower",
          },
          {
            type: "CUSTOM",
            text: "Destroy it",
          },
        ],
      },
    },
  ],
};
