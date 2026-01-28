import type { PilotCardDefinition } from "@tcg/gundam-types";

export const MaridaCruz: PilotCardDefinition = {
  id: "gd01-093",
  name: "Marida Cruz",
  cardNumber: "GD01-093",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "red",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【During Link】【Attack】Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-093.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: ["neo", "zeon", "cyber-newtype"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "eff-smmo19058",
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
      id: "eff-zp03rym43",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "is equal to or lower than this Unit",
          },
          {
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
        ],
      },
    },
  ],
};
