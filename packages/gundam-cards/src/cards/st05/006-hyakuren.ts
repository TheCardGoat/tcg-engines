import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Hyakuren: UnitCardDefinition = {
  id: "st05-006",
  name: "Hyakuren",
  cardNumber: "ST05-006",
  setCode: "ST05",
  cardType: "UNIT",
  rarity: "common",
  level: 3,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST05-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["teiwaz"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "st05-006-effect-1",
      description: "-",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "-",
      },
    },
  ],
};
