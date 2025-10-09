import type { UnitCardDefinition } from "../../card-types";

export const GundamSandrock: UnitCardDefinition = {
  id: "st02-004",
  name: "Gundam Sandrock",
  cardNumber: "ST02-004",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 4,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-004.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 3,
  zones: ["earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["quatre-raberba-winner"],
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
