import type { UnitCardDefinition } from "@tcg/gundam-types";

export const StarkJegan: UnitCardDefinition = {
  ap: 3,
  cardNumber: "GD01-017",
  cardType: "UNIT",
  color: "blue",
  cost: 3,
  hp: 3,
  id: "gd01-017",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-017.webp?26013001",
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
  level: 3,
  linkRequirements: ["(earth-federation)-trait"],
  name: "Stark Jegan",
  rarity: "common",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)",
  traits: ["earth", "federation"],
  zones: ["space", "earth"],
};
