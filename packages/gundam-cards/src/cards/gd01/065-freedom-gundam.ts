import type { UnitCardDefinition } from "@tcg/gundam-types";

export const FreedomGundam: UnitCardDefinition = {
  id: "gd01-065",
  name: "Freedom Gundam",
  cardNumber: "GD01-065",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 7,
  cost: 5,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\n【During Pair】【Once per Turn】When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit. It gets AP-2 during this turn.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-065.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 4,
  hp: 6,
  zones: ["space", "earth"],
  traits: ["triple", "ship", "alliance"],
  linkRequirements: ["kira-yamato"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "eff-9wd80sbr6",
      type: "CONSTANT",
      description:
        "【Once per Turn】When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit. It gets AP-2 during this turn.",
      restrictions: [
        {
          type: "ONCE_PER_TURN",
        },
      ],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "CUSTOM",
            text: "When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit",
          },
          {
            type: "MODIFY_STATS",
            attribute: "AP",
            value: -2,
            duration: "TURN",
          },
        ],
      },
    },
  ],
};
