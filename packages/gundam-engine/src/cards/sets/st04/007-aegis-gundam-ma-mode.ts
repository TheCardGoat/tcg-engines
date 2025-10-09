import type { UnitCardDefinition } from "../../card-types";

export const AegisGundamMaMode: UnitCardDefinition = {
  id: "st04-007",
  name: "Aegis Gundam (MA Mode)",
  cardNumber: "ST04-007",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 4,
  cost: 3,
  text: "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-007.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["athrun-zala"],
  keywords: [
    {
      keyword: "Breach",
      value: 3,
    },
  ],
  abilities: [
    {
      description:
        "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
      effect: {
        type: "UNKNOWN",
        rawText:
          "<Breach 3> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)",
      },
    },
  ],
};
