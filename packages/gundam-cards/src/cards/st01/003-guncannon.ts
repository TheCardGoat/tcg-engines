import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Guncannon: UnitCardDefinition = {
  id: "st01-003",
  name: "Guncannon",
  cardNumber: "ST01-003",
  setCode: "ST01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST01-003.webp?2510031",
  sourceTitle: "Mobile Suit Gundam",
  ap: 2,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["earth", "federation", "white", "base", "team"],
  linkRequirements: ["kai-shiden"],
  effects: [
    {
      id: "eff-ttrdcv2zx",
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
