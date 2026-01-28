import type { PilotCardDefinition } from "@tcg/gundam-types";

export const DuoMaxwell: PilotCardDefinition = {
  id: "gd01-090",
  name: "Duo Maxwell",
  cardNumber: "GD01-090",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【During Link】This Unit&#039;s AP can&#039;t be reduced by enemy effects.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-090.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  traits: ["operation", "meteor"],
  apModifier: 1,
  hpModifier: 2,
  effects: [
    {
      id: "eff-xa2rkajsv",
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
      id: "eff-wfhfr6l09",
      type: "CONSTANT",
      description:
        "This Unit&#039;s AP can&#039;t be reduced by enemy effects.",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "&#039;s AP can&#039;t be reduced by enemy effects.",
      },
    },
  ],
};
