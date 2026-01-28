import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Zaku: UnitCardDefinition = {
  id: "st03-007",
  name: "Zaku Ⅰ",
  cardNumber: "ST03-007",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "common",
  color: "green",
  level: 1,
  cost: 1,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-007.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 1,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-cehh3rkn8",
      type: "CONSTANT",
      description: "-",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "-",
      },
    },
  ],
};
