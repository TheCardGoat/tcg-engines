import type { UnitCardDefinition } from "../../card-types";

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
  abilities: [
    {
      trigger: "DURING_PAIR",
      description:
        "【During Pair】 【Once per Turn】When you pair a Pilot with this Unit or one of your white Units, choose 1 enemy Unit. It gets AP-2 during this turn.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -2,
        duration: "turn",
      },
    },
  ],
};
