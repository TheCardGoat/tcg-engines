import type { UnitCardDefinition } from "@tcg/gundam-types";

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
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-gu1hp2v9f",
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
