import type { CommandCardDefinition } from "@tcg/gundam-types";

export const CloseCombat: CommandCardDefinition = {
  id: "st03-013",
  name: "Close Combat",
  cardNumber: "ST03-013",
  setCode: "ST03",
  cardType: "COMMAND",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 2,
  text: "【Burst】Activate this card's 【Main】.\n【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  effects: [
    {
      id: "eff-42i6qlqm9",
      type: "TRIGGERED",
      timing: "BURST",
      description: "Activate this card's",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "Activate this card's",
      },
    },
    {
      id: "eff-roqvfzwz2",
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
      id: "eff-qcn282dr4",
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
      id: "eff-a8o5xmtcq",
      type: "CONSTANT",
      description: "Choose 1 enemy Unit. Deal 2 damage to it.",
      restrictions: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 2,
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
  ],
};
