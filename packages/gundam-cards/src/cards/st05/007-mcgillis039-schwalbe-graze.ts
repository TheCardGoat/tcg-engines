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
      id: "eff-d25vpjk0o",
      type: "TRIGGERED",
      timing: "WHEN_PAIRED",
      description:
        "Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "3 or lower",
          },
          {
            type: "MODIFY_STATS",
            attribute: "AP",
            value: -2,
            duration: "TURN",
            target: {
              controller: "OPPONENT",
              cardType: "UNIT",
              count: {
                min: 1,
                max: 1,
              },
              filters: [],
            },
          },
        ],
      },
    },
  ],
};
