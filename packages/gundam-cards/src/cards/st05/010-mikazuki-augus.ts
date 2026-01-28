import type { PilotCardDefinition } from "@tcg/gundam-types";

export const MikazukiAugus: PilotCardDefinition = {
  id: "st05-010",
  name: "Mikazuki Augus",
  cardNumber: "ST05-010",
  setCode: "ST05",
  cardType: "PILOT",
  rarity: "common",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Paired】Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  traits: ["tekkadan", "alaya-vijnana"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "eff-2zmywj9s4",
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
      id: "eff-fkymyg5un",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description:
        "Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
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
  ],
};
