import type { UnitCardDefinition } from "../../card-types";

export const AileStrikeGundam: UnitCardDefinition = {
  id: "st04-001",
  name: "Aile Strike Gundam",
  cardNumber: "ST04-001",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "legendary",
  color: "white",
  level: 5,
  cost: 4,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\n【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 4,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["earth", "alliance"],
  linkRequirements: ["kira-yamato"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  abilities: [
    {
      description:
        "<Blocker> (Rest this Unit to change the attack target to it.) 【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "<Blocker> (Rest this Unit to change the attack target to it.) 【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.",
      },
    },
  ],
};
