import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GrazeCommanderType: UnitCardDefinition = {
  id: "st05-008",
  name: "Graze Commander Type",
  cardNumber: "ST05-008",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 3,
  cost: 2,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-008.webp?26013001",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["gjallarhorn"],
  linkRequirements: ["(gjallarhorn)-trait"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
};
