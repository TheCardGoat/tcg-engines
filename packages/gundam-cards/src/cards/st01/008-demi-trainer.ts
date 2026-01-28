import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DemiTrainer: UnitCardDefinition = {
  id: "st01-008",
  name: "Demi Trainer",
  cardNumber: "ST01-008",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 1,
  cost: 1,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-008.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 1,
  hp: 1,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
};
