import type { UnitCardDefinition } from "../../card-types";

export const GundamAerialBitOnForm: UnitCardDefinition = {
  id: "st01-007",
  name: "Gundam Aerial (Bit on Form)",
  cardNumber: "ST01-007",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-007.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 3,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["suletta-mercury"],
  abilities: [
    {
      description: "-",
      effect: {
        type: "UNKNOWN",
        rawText: "-",
      },
    },
  ],
};
