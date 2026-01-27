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
      id: "st05-014-effect-1",
      description:
        "【Burst】 Choose 1 enemy Unit. Deal 1 damage to it. 【Main】Choose 1 enemy Unit that is Lv.3 or lower. Destroy it.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "DAMAGE",
        parameters: {
          target: {
            type: "unknown",
            rawText: "it",
          },
          amount: 1,
        },
      },
    },
  ],
};
