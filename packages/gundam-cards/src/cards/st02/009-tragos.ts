import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Tragos: UnitCardDefinition = {
  id: "st02-009",
  name: "Tragos",
  cardNumber: "ST02-009",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 1,
  cost: 1,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-009.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 1,
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
      id: "st02-009-effect-1",
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
