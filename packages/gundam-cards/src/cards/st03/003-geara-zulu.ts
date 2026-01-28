import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GearaZulu: UnitCardDefinition = {
  id: "st03-003",
  name: "Geara Zulu",
  cardNumber: "ST03-003",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 3,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-003.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["(neo-zeon)-trait"],
  effects: [
    {
      id: "eff-hxetn3feq",
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
