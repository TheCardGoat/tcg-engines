import type { UnitCardDefinition } from "../../card-types";

export const StrikeGundam: UnitCardDefinition = {
  id: "gd01-077",
  name: "Strike Gundam",
  cardNumber: "GD01-077",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 4,
  cost: 2,
  text: "-",
  imageUrl: "../images/cards/card/GD01-077.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "alliance",
  ],
  linkRequirements: [
    "kira-yamato",
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
