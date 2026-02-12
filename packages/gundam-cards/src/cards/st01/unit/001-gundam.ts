import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gundam: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST01-001",
  cardType: "UNIT",
  color: "blue",
  cost: 3,
  hp: 4,
  id: "st01-001",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST01-001.webp?26013001",
  keywords: [
    {
      keyword: "Repair",
      value: 2,
    },
  ],
  level: 4,
  linkRequirements: ["amuro-ray"],
  name: "Gundam",
  rarity: "legendary",
  setCode: "ST01",
  sourceTitle: "Mobile Suit Gundam",
  text: "<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Pair】During your turn, all your Units get AP+1.",
  traits: ["earth", "federation", "white", "base", "team"],
  zones: ["space", "earth"],
};
