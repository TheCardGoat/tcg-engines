import type { UnitCardDefinition } from "@tcg/gundam-types";

export const AileStrikeGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "ST04-001",
  cardType: "UNIT",
  color: "white",
  cost: 4,
  hp: 4,
  id: "st04-001",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-001.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 5,
  linkRequirements: ["kira-yamato"],
  name: "Aile Strike Gundam",
  rarity: "legendary",
  setCode: "ST04",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\n【When Paired･Lv.4 or Higher Pilot】Choose 1 enemy Unit with 4 or less HP. Return it to its owner's hand.",
  traits: ["earth", "alliance"],
  zones: ["space", "earth"],
};
