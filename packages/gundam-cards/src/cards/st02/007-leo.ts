import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Leo: UnitCardDefinition = {
  id: "st02-007",
  name: "Leo",
  cardNumber: "ST02-007",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-007.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["oz"],
  linkRequirements: ["(oz)-trait"],
  effects: [
    {
      id: "st02-007-effect-1",
      description: "-",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "-",
      },
    },
  ],
};
