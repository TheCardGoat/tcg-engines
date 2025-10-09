import type { UnitCardDefinition } from "../../card-types";

export const Gm: UnitCardDefinition = {
  id: "st01-005",
  name: "GM",
  cardNumber: "ST01-005",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 2,
  cost: 1,
  text: "-",
  imageUrl: "../images/cards/card/ST01-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
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
