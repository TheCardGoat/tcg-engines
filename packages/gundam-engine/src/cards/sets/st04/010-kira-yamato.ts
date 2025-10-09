import type { PilotCardDefinition } from "../../card-types";

export const KiraYamato: PilotCardDefinition = {
  id: "st04-010",
  name: "Kira Yamato",
  cardNumber: "ST04-010",
  setCode: "ST04",
  cardType: "PILOT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.
【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.
",
  imageUrl: "../images/cards/card/ST04-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  traits: [
    "earth",
    "alliance",
    "coordinator",
  ],
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
      trigger: "ON_ATTACK",
      description: "【Attack】 Choose 1 enemy Unit. It gets AP-2 during this battle.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -2,
        duration: "turn",
      },
    },
  ],
};
