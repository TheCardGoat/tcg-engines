import type { UnitCardDefinition } from "../../card-types";

export const Loto: UnitCardDefinition = {
  id: "gd01-011",
  name: "Loto",
  cardNumber: "GD01-011",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl: "../images/cards/card/GD01-011.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 2,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
  ],
  linkRequirements: [
    "(earth-federation)-trait",
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
