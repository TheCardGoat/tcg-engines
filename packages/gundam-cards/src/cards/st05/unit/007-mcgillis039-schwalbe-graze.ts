import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Mcgillis039SchwalbeGraze: UnitCardDefinition = {
  ap: 4,
  cardNumber: "ST05-007",
  cardType: "UNIT",
  color: "white",
  cost: 3,
  hp: 2,
  id: "st05-007",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST05-007.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 4,
  linkRequirements: ["mcgillis-fareed"],
  name: "McGillis&#039; Schwalbe Graze",
  rarity: "legendary",
  setCode: "ST05",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)\n【When Paired】Choose 1 enemy Unit that is Lv.3 or lower. It gets AP-2 during this turn.",
  traits: ["gjallarhorn"],
  zones: ["space", "earth"],
};
