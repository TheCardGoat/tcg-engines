import type { PilotCardDefinition } from "@tcg/gundam-types";

export const CagalliYulaAthha: PilotCardDefinition = {
  id: "gd01-096",
  name: "Cagalli Yula Athha",
  cardNumber: "GD01-096",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\nWhile this Unit is white, it gains <Blocker>.\n\n(Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-096.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: ["orb"],
  apModifier: 1,
  hpModifier: 1,
  effects: [
    {
      id: "eff-ot231irrj",
      type: "TRIGGERED",
      timing: "BURST",
      description:
        "Add this card to your hand. While this Unit is white, it gains . (Rest this Unit to change the attack target to it.)",
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
      keyword: "Blocker",
    },
  ],
};
