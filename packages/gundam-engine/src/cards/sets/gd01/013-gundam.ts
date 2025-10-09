import type { UnitCardDefinition } from "../../card-types";

export const Gundam: UnitCardDefinition = {
  id: "gd01-013",
  name: "Gundam",
  cardNumber: "GD01-013",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 4,
  cost: 2,
  text: "-",
  imageUrl: "../images/cards/card/GD01-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 3,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
    "white",
    "base",
    "team",
  ],
  linkRequirements: [
    "amuro-ray",
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
