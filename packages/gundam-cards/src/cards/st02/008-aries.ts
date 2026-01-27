import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Aries: UnitCardDefinition = {
  id: "st02-008",
  name: "Aries",
  cardNumber: "ST02-008",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 2,
  cost: 2,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-008.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 2,
  hp: 1,
  zones: ["earth"],
  traits: ["oz"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "st02-008-effect-1",
      description:
        "<Blocker> (Rest this Unit to change the attack target to it.)",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "<Blocker> (Rest this Unit to change the attack target to it.)",
      },
    },
  ],
};
