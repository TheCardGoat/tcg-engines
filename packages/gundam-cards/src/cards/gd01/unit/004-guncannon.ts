import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guncannon: UnitCardDefinition = {
  ap: 2,
  cardNumber: "GD01-004",
  cardType: "UNIT",
  color: "blue",
  cost: 2,
  hp: 3,
  id: "gd01-004",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-004.webp?26013001",
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  level: 3,
  linkRequirements: ["(white-base-team)-trait"],
  name: "Guncannon",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)\n【When Paired】Choose 1 enemy Unit with 2 or less HP. Rest it.",
  traits: ["earth", "federation", "white", "base", "team"],
  zones: ["space", "earth"],
};
