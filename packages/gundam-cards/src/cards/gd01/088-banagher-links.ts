import type { PilotCardDefinition } from "@tcg/gundam-types";

export const BanagherLinks: PilotCardDefinition = {
  id: "gd01-088",
  name: "Banagher Links",
  cardNumber: "GD01-088",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "uncommon",
  color: "blue",
  level: 5,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【When Linked】Draw 1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-088.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: ["civilian", "newtype"],
  apModifier: 2,
  hpModifier: 2,
  effects: [
    {
      id: "eff-dbg1nqeun",
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
      id: "eff-jrj8vuqko",
      type: "TRIGGERED",
      timing: "WHEN_LINKED",
      description: "Draw 1.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DRAW",
        value: 1,
      },
    },
  ],
};
