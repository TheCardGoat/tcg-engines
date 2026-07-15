import type { UnitCardDefinition } from "@tcg/gundam-types";

export const DeltaPlus: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-006",
  cardType: "UNIT",
  color: "blue",
  cost: 3,
  hp: 3,
  id: "gd01-006",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-006.webp?26013001",
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  level: 4,
  linkRequirements: ["(earth-federation)-trait"],
  name: "Delta Plus",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【During Link】This Unit gets HP+1.",
  traits: ["earth", "federation"],
  zones: ["space", "earth"],
};
