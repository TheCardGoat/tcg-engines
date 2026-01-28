import type { PilotCardDefinition } from "@tcg/gundam-types";

export const RiddheMarcenas: PilotCardDefinition = {
  id: "gd01-089",
  name: "Riddhe Marcenas",
  cardNumber: "GD01-089",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\nWhile this Unit has <Repair>, it gets AP+1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-089.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: ["earth", "federation"],
  apModifier: 1,
  hpModifier: 1,
  effects: [
    {
      id: "eff-akbmqbyua",
      type: "TRIGGERED",
      timing: "BURST",
      description:
        "Add this card to your hand. While this Unit has , it gets AP+1.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
      },
    },
  ],
  keywords: [
    {
      keyword: "Repair",
    },
  ],
};
