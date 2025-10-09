import type { UnitCardDefinition } from "../../card-types";

export const GrazeCustom: UnitCardDefinition = {
  id: "st05-004",
  name: "Graze Custom",
  cardNumber: "ST05-004",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "common",
  level: 2,
  cost: 1,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-004.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["tekkadan"],
  linkRequirements: ["-"],
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
