import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zaku_ST03_008: UnitCardDefinition = {
  id: "st03-008",
  name: "Zaku Ⅱ",
  cardNumber: "ST03-008",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 1,
  text: "【Attack】This Unit gets AP+2 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-008.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "st03-008-effect-1",
      description: "【Attack】 This Unit gets AP+2 during this turn.",
      type: "TRIGGERED",
      timing: "ATTACK",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: 2,
          duration: "turn",
        },
      },
    },
  ],
};
