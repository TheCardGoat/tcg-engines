import type { PilotCardDefinition } from "@tcg/gundam-types";

export const CharAznable: PilotCardDefinition = {
  id: "st03-011",
  name: "Char Aznable",
  cardNumber: "ST03-011",
  setCode: "ST03",
  cardType: "PILOT",
  rarity: "common",
  color: "green",
  level: 3,
  cost: 1,
  text: "【Burst】Add this card to your hand.\n【Attack】During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>.\n\r\n(This Unit can't be blocked.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  traits: ["zeon", "newtype"],
  apModifier: 1,
  hpModifier: 1,
  effects: [
    {
      id: "st03-011-effect-1",
      description: "【Burst】 Add this card to your hand.",
      type: "TRIGGERED",
      timing: "BURST",
      action: {
        type: "CUSTOM",
        text: "Add this card to your hand.",
      },
    },
    {
      id: "st03-011-effect-2",
      description:
        "【Attack】 During this turn, this Unit gets AP+1 and, if it is a Link Unit, it gains <High-Maneuver>. (This Unit can't be blocked.)",
      type: "TRIGGERED",
      timing: "ATTACK",
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
