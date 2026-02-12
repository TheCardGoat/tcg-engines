import type { UnitCardDefinition } from "@tcg/gundam-types";

export const AegisGundamMaMode: UnitCardDefinition = {
  ap: 3,
  cardNumber: "ST04-007",
  cardType: "UNIT",
  color: "red",
  cost: 3,
  hp: 4,
  id: "st04-007",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST04-007.webp?26013001",
  keywords: [
    {
      keyword: "Breach",
      value: 3,
    },
  ],
  level: 4,
  linkRequirements: ["athrun-zala"],
  name: "Aegis Gundam (MA Mode)",
  rarity: "common",
  setCode: "ST04",
  sourceTitle: "Mobile Suit Gundam SEED",
  text: "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  traits: ["zaft"],
  zones: ["space", "earth"],
};
