import type { PilotCardDefinition } from "../../card-types";

export const MaridaCruz: PilotCardDefinition = {
  id: "gd01-093",
  name: "Marida Cruz",
  cardNumber: "GD01-093",
  setCode: "GD01",
  cardType: "PILOT",
  rarity: "rare",
  color: "red",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.
【During Link】【Attack】Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.
",
  imageUrl: "../images/cards/card/GD01-093.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  traits: [
    "neo",
    "zeon",
    "cyber-newtype",
  ],
  apModifier: 2,
  hpModifier: 1,
  abilities: [
    {
      trigger: "ON_BURST",
      description: "【Burst】 Add this card to your hand. 【During Link】",
      effect: {
        type: "UNKNOWN",
        rawText: "Add this card to your hand. 【During Link】",
      },
    },
    {
      trigger: "ON_ATTACK",
      description: "【Attack】 Choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Deal 1 damage to it.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
