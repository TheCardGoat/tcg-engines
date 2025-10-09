import type { UnitCardDefinition } from "../../card-types";

export const Kshatriya: UnitCardDefinition = {
  id: "gd01-051",
  name: "Kshatriya",
  cardNumber: "GD01-051",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "red",
  level: 4,
  cost: 2,
  text: "-",
  imageUrl: "../images/cards/card/GD01-051.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "neo",
    "zeon",
  ],
  linkRequirements: [
    "(cyber-newtype)-trait",
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
