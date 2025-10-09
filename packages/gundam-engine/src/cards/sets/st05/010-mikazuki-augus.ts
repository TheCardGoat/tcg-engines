import type { PilotCardDefinition } from "../../card-types";

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
      trigger: "WHEN_PAIRED",
      description:
        "【When Paired】 Choose 1 of your Units and 1 enemy Unit. Deal 1 damage to them.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "them",
        },
      },
    },
  ],
};
