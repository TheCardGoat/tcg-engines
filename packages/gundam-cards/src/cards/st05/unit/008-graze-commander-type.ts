import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GrazeCommanderType: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST05-008",
  cardType: "UNIT",
  color: "white",
  cost: 2,
  hp: 2,
  id: "st05-008",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-008.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 3,
  linkRequirements: ["(gjallarhorn)-trait"],
  name: "Graze Commander Type",
  rarity: "common",
  setCode: "ST05",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  traits: ["gjallarhorn"],
  zones: ["space", "earth"],
};
