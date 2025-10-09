import type { UnitCardDefinition } from "../../card-types";

export const Gelgoog: UnitCardDefinition = {
  id: "gd01-031",
  name: "Gelgoog",
  cardNumber: "GD01-031",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "green",
  level: 4,
  cost: 2,
  text: "-",
  imageUrl: "../images/cards/card/GD01-031.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 4,
  hp: 3,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "zeon",
  ],
  linkRequirements: [
    "(zeon)-trait",
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
