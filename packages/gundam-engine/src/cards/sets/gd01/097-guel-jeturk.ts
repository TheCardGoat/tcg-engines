import type { PilotCardDefinition } from "../../card-types";

export const GuelJeturk: PilotCardDefinition = {
  id: "gd01-097",
  name: "Guel Jeturk",
  cardNumber: "GD01-097",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "uncommon",
  color: "white",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Activate･Main】【Once per Turn】If your opponent has 8 or more cards in their hand, set this Unit as active. It can&#039;t attack during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-097.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  traits: ["academy"],
  apModifier: 1,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand.",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand.",
      },
    },
    {
      activated: {
        timing: "MAIN",
      },
      description:
        "【Activate･Main】 【Once per Turn】If your opponent has 8 or more cards in their hand, set this Unit as active. It can&#039;t attack during this turn.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "【Once per Turn】If your opponent has 8 or more cards in their hand, set this Unit as active. It can&#039;t attack during this turn.",
      },
    },
  ],
};
