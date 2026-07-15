import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DemiTrainer: UnitCardDefinition = {
  ap: 1,
  cardNumber: "ST01-008",
  cardType: "UNIT",
  color: "white",
  cost: 1,
  hp: 1,
  id: "st01-008",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-008.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 1,
  linkRequirements: ["-"],
  name: "Demi Trainer",
  rarity: "common",
  setCode: "ST01",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  traits: ["academy"],
  zones: ["space", "earth"],
};
