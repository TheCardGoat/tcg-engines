import type { UnitCardDefinition } from "../../card-types";

export const Maganac: UnitCardDefinition = {
  id: "st02-005",
  name: "Maganac",
  cardNumber: "ST02-005",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 3,
  hp: 2,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "maganac",
    "corps",
  ],
  linkRequirements: [
    "-",
  ],
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
