import type { PilotCardDefinition } from "@tcg/gundam-types";

export const M039quve: PilotCardDefinition = {
  id: "gd01-092",
  name: "M&#039;Quve",
  cardNumber: "GD01-092",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\nWhile this Unit is (Zeon), it gains <Breach 1>.\n\n(When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-092.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  traits: ["zeon"],
  apModifier: 1,
  hpModifier: 1,
  effects: [
    {
      id: "eff-vdzeji7vo",
      type: "TRIGGERED",
      timing: "BURST",
      description:
        "Add this card to your hand. While this Unit is (Zeon), it gains . (When this Unit&#039;s attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent&#039;s shield area.)",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "DAMAGE",
        value: 0,
      },
    },
  ],
  keywords: [
    {
      keyword: "Breach",
      value: 1,
    },
  ],
};
