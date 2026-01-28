import type { PilotCardDefinition } from "@tcg/gundam-types";

export const KiraYamato: PilotCardDefinition = {
  id: "st04-010",
  name: "Kira Yamato",
  cardNumber: "ST04-010",
  setCode: "ST04",
  cardType: "PILOT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: ["earth", "alliance", "coordinator"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "eff-t873cv0vz",
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
      id: "eff-h6bqzbxij",
      type: "TRIGGERED",
      timing: "ATTACK",
      description: "Choose 1 enemy Unit. It gets AP-2 during this battle.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "MODIFY_STATS",
        attribute: "AP",
        value: -2,
        duration: "TURN",
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
