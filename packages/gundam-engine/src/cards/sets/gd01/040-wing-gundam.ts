import type { UnitCardDefinition } from "../../card-types";

export const WingGundam: UnitCardDefinition = {
  id: "gd01-040",
  name: "Wing Gundam",
  cardNumber: "GD01-040",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 5,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-040.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["heero-yuy"],
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
