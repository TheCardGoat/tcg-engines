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
      id: "gd01-088-effect-1",
      description:
        "【Burst】 Add this card to your hand. 【When Linked】Draw 1.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Add this card to your hand. 【When Linked】Draw 1.",
      },
    },
  ],
};
