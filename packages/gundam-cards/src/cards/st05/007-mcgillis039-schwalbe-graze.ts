import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Mcgillis039SchwalbeGraze: UnitCardDefinition = {
  id: "st05-007",
  name: "McGillis&#039; Schwalbe Graze",
  cardNumber: "ST05-007",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 4,
  cost: 3,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\n【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-007.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 4,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["gjallarhorn"],
  linkRequirements: ["mcgillis-fareed"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "st05-007-effect-1",
      description:
        "【When Paired】 Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: -2,
          duration: "turn",
        },
      },
    },
  ],
};
