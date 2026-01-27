import type { UnitCardDefinition } from "@tcg/gundam-types";

export const ZakuMariner: UnitCardDefinition = {
  id: "gd01-060",
  name: "Zaku Mariner",
  cardNumber: "GD01-060",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 1,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-060.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 2,
  zones: ["earth"],
  traits: ["zeon"],
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
