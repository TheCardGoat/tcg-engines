import type { PilotCardDefinition } from "@tcg/gundam-types";

export const SulettaMercury: PilotCardDefinition = {
  id: "st01-011",
  name: "Suletta Mercury",
  cardNumber: "ST01-011",
  setCode: "ST01",
  cardType: "PILOT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Attack】【Once per Turn】Choose 1 of your Resources. Set it as active.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  traits: ["academy"],
  apModifier: 1,
  hpModifier: 2,
  effects: [
    {
      id: "eff-2geat1wdx",
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
      id: "eff-4h3uuaddw",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "【Once per Turn】Choose 1 of your Resources. Set it as active.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      costs: [],
      conditions: [],
      action: {
        type: "STAND",
        target: {
          controller: "SELF",
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
