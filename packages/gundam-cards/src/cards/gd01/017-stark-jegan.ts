import type { UnitCardDefinition } from "@tcg/gundam-types";

export const StarkJegan: UnitCardDefinition = {
  id: "gd01-017",
  name: "Stark Jegan",
  cardNumber: "GD01-017",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 3,
  text: "<Repair 1> (At the end of your turn, this Unit recovers the specified number of HP.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-017.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["(earth-federation)-trait"],
  keywords: [
    {
      keyword: "Repair",
      value: 1,
    },
  ],
};
