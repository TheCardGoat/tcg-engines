import type { PilotCardDefinition } from "@tcg/gundam-types";

export const HeeroYuy: PilotCardDefinition = {
  id: "st02-010",
  name: "Heero Yuy",
  cardNumber: "ST02-010",
  setCode: "ST02",
  cardType: "PILOT",
  rarity: "common",
  color: "green",
  level: 4,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【During Link】This Unit gets AP+1 and HP+1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-010.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  traits: ["operation", "meteor"],
  apModifier: 2,
  hpModifier: 1,
  effects: [
    {
      id: "st02-010-effect-1",
      description:
        "【Burst】 Add this card to your hand. 【During Link】This Unit gets AP+1 and HP+1.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: 1,
          duration: "turn",
        },
      },
    },
  ],
};
